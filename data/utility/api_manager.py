import time
import json

from kickbase_api.kickbase import Kickbase
from utility.constants import CUTOFF_DATE_STRING


class ApiManager:
    def __init__(self, args):
        # Query cache
        self.executed_queries = {}

        # Login
        self.api = Kickbase()
        _, leagues = self.api.login(args.kbuser, args.kbpw)

        # Meta
        self.league = leagues[0]  # Might need to be set manually if account is in multiple leagues/challenges
        self.users = [user for user in self.api.league_users(self.league)
                      if user.name not in args.ignore]
        
        # Write a file for the users
        userData = []
        for user in self.users:
             userData.append({'id': user.id,
                             'name': user.name,
                             'budget': user.budget if hasattr(user, "budget") else None})

        with open('users.json', 'w') as f:
            f.writelines(json.dumps(userData))

    # Simple caching
    def get(self, endpoint: str):
        if endpoint not in self.executed_queries:
            self.executed_queries[endpoint] = self.api._do_get(endpoint, True).json()

        return self.executed_queries[endpoint]

    def get_transfers_raw(self, league_id, user_id):
        transfers_raw = []
        offset = 0

        response = self.get(f'/leagues/{league_id}/users/{user_id}/feed?filter=12&start={offset}')

        while response['items']:
            #Append all valid items
            for item in response['items']:
                if 'date' in item and item['date'] >= CUTOFF_DATE_STRING:
                    transfers_raw.append(item)
                else:
                    # Abort the loop when an item has a date property before cutoffDate
                    break
            else:
                 # If the loop did not break, fetch the next response
                offset += 25
                response = self.get(f'/leagues/{league_id}/users/{user_id}/feed?filter=12&start={offset}')
                continue

            break

        return transfers_raw