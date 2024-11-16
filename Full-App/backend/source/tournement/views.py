# FOR TESTING ONLY 

from .models import Competition, Rooms
from rest_framework.response import Response
from rest_framework.decorators import api_view

# DELETE ALL COMPITITION (no authentication require)

@api_view(['GET'])
def delete_tournement(request):
    obj = Competition.objects.all()
    obj.delete()
    obj = Rooms.objects.all()
    obj.delete()
    return Response({'success' : 'ALL TOURNEMENT DATA HAS DESTROYED !'}, status=200)

# VIEW ALL COMPITITION (no authentication require)

@api_view(['GET'])
def view_tournement(request):
    obj = Competition.objects.all()
    if not obj:
        return Response({'information' : 'nothing yet !'}, status=200)
    
    data = []
    for o in obj:
        
        information = {}
        information['room-id'] = o.id
        information['all_join'] = o.teams
        information['macth_ends'] = o.finished
        
        if o.smi1:
            information['p1'] = o.smi1.player1.username
            information['p2'] = o.smi1.player2.username if o.smi1.player2 else None
            information['JSON-SMI1'] = o.smi1.structure
        
        if o.smi2:
            information['p3'] = o.smi2.player1.username
            information['p4'] = o.smi2.player2.username if o.smi2.player2 else None
            information['JSON-SMI2'] = o.smi2.structure

        if o.final:
            information['final-p1'] = o.final.player1.username if o.final.player1 else None
            information['final-p2'] = o.final.player2.username if o.final.player2 else None
            information['JSON'] = o.final.structure

        data.append(information)

    return Response({'competitions' : data}, status=200)
