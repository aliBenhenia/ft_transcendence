import sys
import sqlite3
import importlib

# Reload the sqlite3 module
sqlite3 = importlib.reload(sqlite3)

# Verify if the module is reloaded correctly
print(sqlite3)
