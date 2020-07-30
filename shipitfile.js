module.exports = (shipit) => {
  // Load shipit-deploy tasks
  require("shipit-deploy")(shipit);

  const REMOTE_PROJECT_PATH = "~/Production/MixCapsule/";

  shipit.initConfig({
    default: {
      ignores: ["database", "__pycache__", ".vscode", "venv"],
      key: "~/.ssh/id_rsa",
      shallowClone: true,
      servers: "paul@paulbiberstein.me",
    },
  });

  shipit.blTask("buildFrontend", async () => {
    const taskPromise = shipit.local("npm run-script build", {
      cwd: "frontend",
    });
    return taskPromise;
  });

  shipit.task("deployFrontend", async () => {
    await shipit.copyToRemote(
      "frontend/build/",
      REMOTE_PROJECT_PATH + "frontend"
    );
  });

  shipit.task("deployBackend", async () => {
    await shipit.copyToRemote("backend/", REMOTE_PROJECT_PATH + "backend");
    await shipit.remote("rm backend/backend/settings.py", { cwd: REMOTE_PROJECT_PATH + "backend/backend"});
    await shipit.remote("mv prod_settings.py settings.py", { cwd: REMOTE_PROJECT_PATH + "backend/backend"});
  });

  shipit.task("copyEnv", async () => {
    await shipit.copyToRemote(".env.prod", REMOTE_PROJECT_PATH + "/.env");
  });

  shipit.task("installDependencies", async () => {
    await shipit.copyToRemote("requirements.txt", REMOTE_PROJECT_PATH);
    await shipit.remote("python3.6 -m venv venv", { cwd: REMOTE_PROJECT_PATH });
    await shipit.remote(
      "source venv/bin/activate && python -m pip install -r requirements.txt",
      { cwd: REMOTE_PROJECT_PATH }
    );
  });

  shipit.task("migrate", async () => {
    await shipit.remote(
      "source venv/bin/activate && python backend/manage.py migrate",
      { cwd: REMOTE_PROJECT_PATH }
    );
  });
  shipit.task("makemigrations", async () => {
    await shipit.remote(
      "source venv/bin/activate && python backend/manage.py makemigrations",
      { cwd: REMOTE_PROJECT_PATH }
    );
  });

  shipit.task("deployScripts", async () => {
    await shipit.copyToRemote("scripts/", REMOTE_PROJECT_PATH + "scripts")
  });

  shipit.task("deployServices", async () => {
    await shipit.copyToRemote("services/", REMOTE_PROJECT_PATH + "services")
  });
};

// ./node_modules/shipit-cli/bin/shipit default buildFrontend deployFrontend deployBackend copyEnv initializeEnvironments
