from rest_framework import serializers
# from api.models import User


# class UserSerializer(serializers.ModelSerializer):
#     # id = serializers.IntegerField(read_only=True)
#     # name = serializers.CharField()

#     # def create(self, validated_data):
#     #     """
#     #     Create and return a new `User` instance, given the validated data.
#     #     """
#     #     return User.objects.create(**validated_data)

#     # def update(self, instance, validated_data):
#     #     """
#     #     Update and return an existing `User` instance, given the validated data.
#     #     """
#     #     instance.name = validated_data.get('name', instance.name)
#     #     instance.save()
#     #     return instance

#     class Meta:
#       model = User
#       fields = ['id', 'name']