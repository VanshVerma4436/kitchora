def predict_delivery_eta(distance_km: float = 3.5, active_kitchen_orders: int = 5) -> int:
    """
    Predict delivery ETA (in minutes) based on distance & kitchen backlog.
    """
    base_prep_time = 18 # mins
    backlog_delay = min(active_kitchen_orders * 2, 20)
    transit_time = int(distance_km * 4) # ~4 mins per km
    total_eta = base_prep_time + backlog_delay + transit_time
    return max(total_eta, 20)
