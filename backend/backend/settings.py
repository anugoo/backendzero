"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 5.1.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
import string, random, smtplib, psycopg2
from email.mime.text import MIMEText
from datetime import datetime
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-&*9wp6*j8auiv(*5$ncdygy(3#a)-o1c48da_933l6d2aer5^a'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'appbackend', # uusgesen app-aa holboj ugch baina.
    'corsheaders', # CORS ashiglaj baina
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',  # add this line if it's not already present
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',  # Allow requests from localhost:3000
]

ROOT_URLCONF = 'backend.urls'

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

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

#Standartiin daguu response json-g 6 key-tei bolgoj beldej baina.
def sendResponse(request, resultCode, data, action="no action"):
    response = {} # response dictionary zarlaj baina
    response["resultCode"] = resultCode # 
    response["resultMessage"] = resultMessages[resultCode] #resultCode-d hargalzah message-g avch baina
    response["data"] = data
    response["size"] = len(data) # data-n urtiig avch baina
    response["action"] = action
    response["curdate"] = datetime.now().strftime('%Y/%m/%d %H:%M:%S') # odoogiin tsagiig response-d oruulj baina

    return response 
#   sendResponse

# result Messages. nemj hugjuuleerei
resultMessages = {
    200:"Success",
    400:'Bad Request',
    404:"Not found",
    1000 : "Burtgeh bolomjgui. Mail hayag umnu burtgeltei baina",
    1001 : "Hereglegch Amjilttai burtgegdlee. Batalgaajuulah mail ilgeegdlee. 24 tsagiin dotor batalgaajuulna.",
    1002 : "Login Successful",
    1003 : "Amjilttai batalgaajlaa",
    1004 : "Hereglegchiin ner, nuuts ug buruu baina.",
    1005 : "edituser success",
    1006 : "getuserresume success",
    1007 : "getalluser success",
    3001 : "ACTION BURUU",
    3002 : "METHOD BURUU",
    3003 : "JSON BURUU",
    3004 : "Token-ii hugatsaa duussan. Idevhgui token baina.",
    3005 : "NO ACTION",
    3006 : "Login service key dutuu",
    3007 : "Register service key dutuu",
    3008 : "Баталгаажсан хэрэглэгч байна. Register service.",
    3009 : "token buruu esvel hugatsaa duussan",
    3010 : "Hereglegchiin burtgel batalgaajlaa",
    3011 : "Forgot password verified",
    3012 : "Forgot password huselt ilgeelee", 
    3013 : "Forgot password user not found", 
    3014 : "Batalgaajsan hereglegch baina. Umnuh burtgeleeree nevterne uu. Mail Link",
    3015 : "no token parameter",
    3016 : "forgot service key dutuu", 
    3017 : "not forgot and register GET token",
    3018 : "reset password key dutuu",
    3019 : "martsan nuuts ugiig shinchille",
    3020 : "token buruu baina esvel hugtsaa dussan. Nuust ugiig shinchilj chadsangu",
    3021 : "change password service key dutuu ",
    3022 : "nuuts ug amjilttai soligdloo ",
    3023 : "huuchin nuuts ug taarsangui ",
    3024 : "edituser service key dutuu",
    3025 : "getuserresume service key dutuu", 
    3026 : "getalluser service key dutuu", 
    3027 : " baraanii delgerengui oldsongui", 
    3028 : "baraanii delgerengui amjilttai",
    3029 : "baraa shinchlelt amjilttai", 
    3030 : "baraa amjilttai nemlee", 
    3031 : "baraa amjilttai ustgalaa",
    3032 : " buh baraanii medeelel oldloo",
    3033 : " buh baraanii medeelel tataj chadsangui",
    3034 : "Supplier medeelel amjilttai awlaa",
    3035 : "Supplier medeelel tatalt amjiltgui",
    3036 : "Turul medeelel amjilttai awlaa",
    3037 : "turul medeelel tatalt amjiltgui",
    5001 : "Login service dotood aldaa",
    5002 : "Register service dotood aldaa",
    5003 : "Forgot service dotood aldaa",
    5004 : "GET method token dotood aldaa",
    5005 : "reset password service dotood aldaa ",
    5006 : "change password service dotood aldaa ",
    5007 : "edituser service dotood aldaa",
    5008 : "getuserresume service dotood aldaa",
    5009 : "getalluser service dotood aldaa",
    5010 : "productdetail service dotood aldaa ",
    5011 : "updateproduct service dotood aldaa ",
    5012 : "addproduct  service dotood aldaa ",
    5013 : "deleteproduct  service dotood aldaa ",
    5014 : "allproduct  service dotood aldaa ",
    5015 : "getsupplier  service dotood aldaa ",
    5016 : "getturul  service dotood aldaa ",

}
# resultMessage

# db connection
def connectDB():
    conn = psycopg2.connect (
        host = 'localhost', #server host
        # host = '59.153.86.251',
        dbname = 'anugoo', # database name
        user = 'postgres', # databse user 
        password = '123', 
        port = '5938', # postgre port
    )
    return conn
# connectDB

# DB disconnect hiij baina
def disconnectDB(conn):
    conn.close()
# disconnectDB

#random string generating
def generateStr(length):
    characters = string.ascii_lowercase + string.digits # jijig useg, toonuud
    password = ''.join(random.choice(characters) for i in range(length)) # jijig useg toonuudiig token-g ugugdsun urtiin daguu (parameter length) uusgej baina
    return password # uusgesen token-g butsaalaa
# generateStr

#Mail yavuulah function
def sendMail(recipient, subj, bodyHtml):
    sender_email = "testmail@mandakh.edu.mn"
    sender_password = "Mandakh2"
    recipient_email = recipient
    subject = subj
    body = bodyHtml
    html_message = MIMEText(body, 'html')
    html_message['Subject'] = subject
    html_message['From'] = sender_email
    html_message['To'] = recipient_email
    with smtplib.SMTP('smtp-mail.outlook.com',587) as server:
        server.ehlo()
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient_email, html_message.as_string())
        server.quit()
#sendMail