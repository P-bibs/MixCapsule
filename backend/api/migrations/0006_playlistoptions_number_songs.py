# Generated by Django 3.0.8 on 2020-07-24 02:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20200724_0241'),
    ]

    operations = [
        migrations.AddField(
            model_name='playlistoptions',
            name='number_songs',
            field=models.PositiveSmallIntegerField(default=50),
        ),
    ]