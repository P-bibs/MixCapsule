from django.contrib import admin

from .models import Profile, PlaylistOptions, SpotifyApiData, GeneratedPlaylist

admin.site.register(Profile)
admin.site.register(PlaylistOptions)
admin.site.register(SpotifyApiData)
admin.site.register(GeneratedPlaylist)
