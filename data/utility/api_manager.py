import time

from kickbase_api.kickbase import Kickbase
from utility.constants import CUTOFF_DATE_STRING


class ApiManager:
    def __init__(self, args):
        # Query cache
        self.executed_queries = {}
        self.last_call_timestamp = 0
        self.throttle_seconds = .1

        # Login
        self.api = Kickbase()
        _, leagues = self.api.login(args.kbuser, args.kbpw)

        # Meta
        self.league = leagues[0]  # Might need to be set manually if account is in multiple leagues/challenges
        self.users = [user for user in self.api.league_users(self.league)
                      if user.name not in args.ignore]

    # Simple caching and throttle of GETs to reduce load on server
    def get(self, endpoint: str):
        if endpoint not in self.executed_queries:
            while time.time() - self.last_call_timestamp < self.throttle_seconds:
                time.sleep(.1)

            self.executed_queries[endpoint] = self.api._do_get(endpoint, True).json()
            self.last_call_timestamp = time.time()

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