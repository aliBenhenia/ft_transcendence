import os
from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-pa*3)%h^dwh@!w#efoey_of83lm@u(ld23f*c9#vvm67+z_&30'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

'''
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'ui']
'''

CORS_ALLOW_ALL_ORIGINS = True

# Application definition

INSTALLED_APPS = [
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'users',
    'pingpong',
    'friends',
    'channels',
    'allauth',
    'notifications',
]

SITE_ID = 421337

CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:5501",
    "http://127.0.0.1:80",
    "http://127.0.0.1:9001",
    "http://127.0.0.1"

]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

# 42 OAUTH CONFIG

'''
OAUTH2_CONFIG = {
    'client_id': 'u-s4t2ud-01778c61d0da91e351b29ebf78b43c37ce513f20f49235dec07b18487278d227',
    'client_secret': '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',
    'authorize_url': 'https://api.intra.42.fr/oauth/authorize',
    'token_url': 'https://api.intra.42.fr/oauth/token',
    'redirect_uri': 'http://localhost:9000/oauth/callback/',
    'scope': 'public',
}
'''

OAUTH2_CONFIG = {
    'client_id': 'u-s4t2ud-18a834e3d07630161d8cf7e12c386f1e2bec5b1365e140159b685cd060b8f5bf',
    'client_secret': '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',
    'authorize_url': 'https://api.intra.42.fr/oauth/authorize',
    'token_url': 'https://api.intra.42.fr/oauth/token',
    'redirect_uri': 'http://localhost:9001',
    'scope': 'public',
}




# ATHENTICATION MODLE

AUTH_USER_MODEL = 'users.Register'


# EMAIL CONFIGURAION 

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'mail-students.1337.ma' 
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
EMAIL_HOST_USER = 'areifoun@student.1337.ma'
EMAIL_HOST_PASSWORD = '1337-user'
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER


SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}


'''

SHARE_HOST = 'http://127.0.0.1'

# CSRF Settings
CSRF_COOKIE_NAME = "csrftoken"
CSRF_HEADER_NAME = "HTTP_X_CSRFTOKEN"
'''

# Allow cookies and other credentials to be included

CORS_ALLOW_CREDENTIALS = True

# Authentication Cookie

AUTH_COOKIE = 'access'

# Max Age Cookie
AUTH_COOKIE_ACCESS_MAX_AGE = 60 * 30  # 10 minutes

# Refresh Time
AUTH_COOKIE_REFRESH_MAX_AGE = 60 * 60 * 24  # 1 day

# Use SSL
AUTH_COOKIE_SECURE = False  # Change to True in production if using HTTPS

# Use HTTP Only

AUTH_COOKIE_HTTP_ONLY = True

# Cookie Path

AUTH_COOKIE_PATH = '/'

# Cookie Same Site

AUTH_COOKIE_SAMESITE = 'Lax'  # Adjust as needed ('Lax', 'Strict', or 'None' with secure cookies)

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'server_api.urls'

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

'''
# Config Celery

CELERY_RESULT_BACKEND = "redis://redis:6379/0"
CELERY_BROKER_URL = "redis://redis:6379/0"
'''

# AsyncGatewayInterface

ASGI_APPLICATION = 'server_api.asgi.application'

# WebServerGatewayInterface

WSGI_APPLICATION = 'server_api.wsgi.application'

# Channel Layer

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('redis', 6379)],
        },
    },
}

# Database

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Config Static

STATIC_URL = 'static/'

# Config Media

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
