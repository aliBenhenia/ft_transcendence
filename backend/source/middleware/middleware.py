from channels.middleware import BaseMiddleware
from urllib.parse import parse_qs
from asgiref.sync import sync_to_async
from register.models import Register
import jwt
from server.settings import SECRET_KEY

class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_params = parse_qs(scope['query_string'].decode())
        token = query_params.get('token', [None])[0]
        if token:
            scope['user'] = await self.get_user_from_token(token)
        else:
            scope['user'] = None
        return await super().__call__(scope, receive, send)

    @sync_to_async
    def get_user_from_token(self, token):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            return Register.objects.get(id=payload['user_id'])
        except Register.DoesNotExist:
            return None