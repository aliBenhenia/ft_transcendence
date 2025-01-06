from pathlib import Path
from datetime import timedelta
import os
import environ

env = environ.Env()
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent # this will give me the root directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent
environ.Env.read_env(os.path.join(ROOT_DIR, '.env'))
##
HOST_IP = env('HOST_IP')
SECRET_KEY = env('SECRET_KEY')

# MEDIA CONFIGURATIONS

MEDIA_URL = 'media/'
MEDIA_ROOT = os.path.join(BASE_DIR , 'media')

# PICTURE FULL URL

FULL_PICTURE = f'https://{HOST_IP}:443/media/avatars/unknown.jpeg'
PATH_PICTURE = f'https://{HOST_IP}:443'

DEBUG = True

ALLOWED_HOSTS = ['*']

ROOT_URLCONF = 'server.urls'

WSGI_APPLICATION = 'server.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('POSTGRES_DB'),
        'USER': env('POSTGRES_USER'),
        'PASSWORD': env('POSTGRES_PASSWORD'),
        'HOST': 'postgres',
        'PORT': '5432',
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
    'django.contrib.sessions',
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


MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:9001",
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
OAUTH_CLIENT_ID=env('UID')
OAUTH_CLIENT_SECRET=env('SECRET')
OAUTH_REDIRECT_URI=env('REDIRECT_URI')

# OAUTH2_CONFIG = {
#     'client_id': 'u-s4t2ud-18a834e3d07630161d8cf7e12c386f1e2bec5b1365e140159b685cd060b8f5bf',
#     'client_secret': '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',
#     'authorize_url': 'https://api.intra.42.fr/oauth/authorize',
#     'token_url': 'https://api.intra.42.fr/oauth/token',
#     'redirect_uri': 'http://localhost:9001',
#     'scope': 'public',
# }

SESSION_ENGINE = 'django.contrib.sessions.backends.db'  # Default backend

#

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'apikey'  # Replace with your email
EMAIL_HOST_PASSWORD = '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'    # Replace with your email's app password
DEFAULT_FROM_EMAIL = 'marwan.zaroual.1337.1@gmail.com'

CSRF_COOKIE_SECURE = False