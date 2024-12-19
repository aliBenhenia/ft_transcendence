from pathlib import Path
from datetime import timedelta
import os

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-bdu%lxz4&6o-xbqg)2==vj#go*^9n&u7a-c#0i5zq)f@e-^k^3'

DEBUG = True

ALLOWED_HOSTS = ['*']

ROOT_URLCONF = 'server.urls'

WSGI_APPLICATION = 'server.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

#####################################   (MANUAL SETUP)   #####################################


# SETUP INSTALLED APPS

INSTALLED_APPS = [
    
    'chat',
    'login',
    'account',
    'friends',
    'security',
    'register',
    'pingpong',
    'notification',

    'daphne',
    'channels',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',

    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.staticfiles',
    
]

# ATHENTICATION MODLE

AUTH_USER_MODEL = 'register.Register'

# RESTFAMEWORK CONFIGURATION 

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

# JWT CONFIGURATIONS

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
}

# MEDIA CONFIGURATIONS

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# PICTURE FULL URL

FULL_PICTURE = 'http://127.0.0.1:9003/register/media/avatars/unknown.jpg'
PATH_PICTURE = 'http://127.0.0.1:9003/register'


MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CROSS-ORIGIN RESOURCE SHARING (CORS)

CORS_ORIGIN_ALLOW_ALL = True

# Define ASGI application :

ASGI_APPLICATION = 'server.asgi.application'

# Configure Channels Redis as the channel layer

# CHANNEL_LAYERS = {
#     'default': {
#         'BACKEND': 'channels_redis.core.RedisChannelLayer',
#         'CONFIG': {
#             "hosts": [('redis', 6379)], 
#         },
#     },
# }

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',  # Using in-memory layer for dev/testing
    },
}

#  42 CONFIGURATIONS 

OAUTH2_CONFIG = {
    'client_id': 'u-s4t2ud-18a834e3d07630161d8cf7e12c386f1e2bec5b1365e140159b685cd060b8f5bf',
    'client_secret': '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',
    'authorize_url': 'https://api.intra.42.fr/oauth/authorize',
    'token_url': 'https://api.intra.42.fr/oauth/token',
    'redirect_uri': 'http://localhost:9001',
    'scope': 'public',
}
