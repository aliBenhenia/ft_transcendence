# asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from friends import routing 

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server_api.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            routing.websocket_urlpatterns
        )
    ),
})


'''

ASGI (Asynchronous Server Gateway Interface) is a specification that serves as a successor to WSGI (Web Server Gateway Interface). 
It allows for handling both synchronous and asynchronous requests, making it suitable for applications that need to:
handle WebSockets, long-lived connections, or other asynchronous protocols.

[+] Key Points:

    WSGI: Handles synchronous HTTP requests.
    ASGI: Handles both synchronous and asynchronous protocols, such as WebSockets and HTTP/2.

Client --> ASGI Server --> Django (ASGI Application) --> Views/Consumers --> Response

[+] Channels :

    is a Django library that extends Django capabilities by allowing it to :
    handle WebSockets, background tasks, and other asynchronous protocols.

[+] WebSocket: A communication protocol that provides full-duplex communication channels over a single TCP connection.

[+] Redis: 
    
    An in-memory data structure store used as a message broker for Channels. 
    Redis facilitates communication between Django (running with Channels) and WebSockets 
    by acting as a layer to pass messages or events.

Client <--> WebSocket <--> Django (Channels) <--> Redis <--> Django (Channels Layer)

[+] How it Works

    1 - Client Side: The client connects to a WebSocket endpoint (e.g., ws://yourdomain/ws/chat/room1/).
    
    2 - ASGI Layer: The connection is handled by the ASGI server
        which routes it to the appropriate consumer using the Channels routing mechanism.
    
    3 - Redis Channel Layer:
    The consumer communicates with other consumers through the Redis channel layer. 
    For example, when a user sends a message, its sent to the Redis layer, which then broadcasts it to all consumers connected to that group.
    
    4 - WebSocket: The consumer sends the message back through the WebSocket connection to all clients connected to that group.

Client 1 ---> WebSocket ---> Django (Channels) ---> Redis ---> Django (Channels) ---> WebSocket ---> Client 2
    ^                                                                                |
    |--------------------------------------------------------------------------------|

'''