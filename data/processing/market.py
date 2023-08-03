from datetime import datetime, timedelta, timezone

from pytz import timezone

from utility import constants
from utility.util import timing_decorator

@timing_decorator
def get_market_players(manager):
    players = []

    for player in manager.api.market(manager.league).players:
        if not player.username:
            player_stats = manager.get(f'/leagues/{manager.league.id}/players/{player.id}/stats')

            expiration_time = (datetime.now(timezone('Europe/Berlin')) + timedelta(seconds=int(player.expiry)))
            players.append({'player_id': player.id,
                            'first_name': player.first_name,
                            'last_name': player.last_name,
                            'price': player.price,
                            'expiration': expiration_time,
                            'team_id': player.team_id,
                            'position': constants.POSITIONS[player.position],
                            'points': player.totalPoints,
                            'averagePoints': player.averagePoints,
                            'offerValue': player.offers[0].price if hasattr(player.offers, "__len__") else None,
                            'offerName': player.offers[0].userName if hasattr(player.offers, "__len__") else None,
                            'trend': player_stats['mvTrend']}),

    return players
