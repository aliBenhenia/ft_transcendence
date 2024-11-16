import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server_api.settings')
django.setup()

from users.models import Register

def delete_record(record_id, key):
    try:
        record = Register.objects.get(id=record_id)
        if key == 1:
            record.delete()
            print(f"Record with id {record_id} deleted successfully.")
        elif key == 2:
            record.is_active = True
            record.save()
            print(f"Record with id {record_id} is activated.")
        else:
            print("Invalid key input. Please enter '1' to delete or '2' to activate.")

    except Register.DoesNotExist:
        print(f"Record with id {record_id} does not exist.")

if __name__ == "__main__":
    try:
        record_id_to_delete = int(input('Enter the Record ID to delete or activate: '))
        key = int(input('Enter "1" to delete the record or "2" to activate: '))
        delete_record(record_id_to_delete, key)
    except ValueError:
        print("Invalid input. Please enter valid numbers.")
