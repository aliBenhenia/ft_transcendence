from django.db.models import Q
from tournement.models import Competition, Rooms

def GetHistory(account):
    rooms = Rooms.objects.filter(Q(player1=account) | Q(player2=account))
    if not rooms.first():
        return False, None

    data = []
    for room in rooms:
        information = {}
        lookup = Competition.objects.filter((Q(smi1=room) | Q(smi2=room))).first()
        if lookup:

            information['TYPE'] = "Friends" if lookup.friends else "Random"
            information['created_at'] = lookup.date_start.strftime('%Y-%m-%d %H:%M:%S')
            information['completed'] = lookup.finished
            information['all_teams_exist'] = lookup.teams

            match_info = {}
            match_info['p1'] = lookup.smi1.player1.username
            match_info['result-p1'] = lookup.smi1.structure[lookup.smi1.player1.username]["result"]
            match_info['p2'] = lookup.smi1.player2.username if lookup.smi1 and lookup.smi1.player2 else "Waiting.."
            if match_info['p2'] == "Waiting..":
                match_info['result-p2'] =  "Waiting.."
            else:
                match_info['result-p2'] = lookup.smi1.structure[lookup.smi1.player2.username]["result"]
            match_info['score'] = lookup.smi1.structure["score"]
            information['semi-final1'] = match_info
            
            match_info = {}
            match_info['p1'] = lookup.smi2.player1.username if lookup.smi2 and lookup.smi2.player1 else "Waiting.."
            if match_info['p1'] == "Waiting..":
                match_info['result-p1'] =  "Waiting.."
            else:
                match_info['result-p1'] = lookup.smi2.structure[lookup.smi2.player1.username]["result"]
            match_info['p2'] = lookup.smi2.player2.username if lookup.smi2 and lookup.smi2.player2 else "Waiting.."
            if match_info['p2'] == "Waiting..":
                match_info['result-p2'] =  "Waiting.."
            else:
                match_info['result-p2'] = lookup.smi2.structure[lookup.smi2.player2.username]["result"]
            match_info['score'] = lookup.smi2.structure["score"] if lookup.smi2 else "Waiting.."
            information['semi-final2'] = match_info

            match_info = {}
            match_info['p1'] = lookup.final.player1.username if lookup.final and lookup.final.player1 else "Waiting.."
            if match_info['p1'] == "Waiting..":
                match_info['result-p1'] =  "Waiting.."
            else:
                match_info['result-p1'] = lookup.final.structure[lookup.final.player1.username]["result"]
            match_info['p2'] = lookup.final.player2.username if lookup.final and lookup.final.player2 else "Waiting.."
            if match_info['p2'] == "Waiting..":
                match_info['result-p2'] =  "Waiting.."
            else:
                match_info['result-p2'] = lookup.final.structure[lookup.final.player2.username]["result"]
            match_info['score'] = lookup.final.structure["score"] if lookup.final else "Waiting.."
            information['final'] = match_info
            
            data.append(information)

    return True, data