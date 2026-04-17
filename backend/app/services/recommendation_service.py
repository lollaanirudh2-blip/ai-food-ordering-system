from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.behavior_event import BehaviorEvent
from app.models.menu_item import MenuItem


def get_time_based_category():
    current_hour = datetime.now().hour

    if 6 <= current_hour < 11:
        return "Breakfast"
    elif 11 <= current_hour < 16:
        return "Lunch"
    elif 16 <= current_hour < 22:
        return "Dinner"
    return "Snacks"


def remove_duplicates(primary, secondary):
    primary_ids = {item["id"] for item in primary}
    return [item for item in secondary if item["id"] not in primary_ids]


def remove_duplicates_from_all(sections):
    seen = set()
    cleaned = {}

    for section_name, items in sections.items():
        unique_items = []
        for item in items:
            if item["id"] not in seen:
                seen.add(item["id"])
                unique_items.append(item)
        cleaned[section_name] = unique_items

    return cleaned


def get_frequent_items(db: Session, user_id: int, limit: int = 5):
    rows = (
        db.query(
            BehaviorEvent.menu_item_id,
            func.count(BehaviorEvent.menu_item_id).label("score")
        )
        .filter(
            BehaviorEvent.user_id == user_id,
            BehaviorEvent.menu_item_id.isnot(None),
            BehaviorEvent.event_type.in_(["add_to_cart", "place_order", "reorder"])
        )
        .group_by(BehaviorEvent.menu_item_id)
        .order_by(func.count(BehaviorEvent.menu_item_id).desc())
        .limit(limit)
        .all()
    )

    item_ids = [row.menu_item_id for row in rows]
    if not item_ids:
        return []

    items = db.query(MenuItem).filter(MenuItem.id.in_(item_ids)).all()

    result = []
    for item in items:
        result.append({
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "price": float(item.price),
            "category": item.category,
            "reason": "You often choose this item",
            "type": "frequent",
            "confidence": "High"
        })

    return result


def get_recent_items(db: Session, user_id: int, limit: int = 5):
    rows = (
        db.query(BehaviorEvent.menu_item_id)
        .filter(
            BehaviorEvent.user_id == user_id,
            BehaviorEvent.menu_item_id.isnot(None),
            BehaviorEvent.event_type.in_(["add_to_cart", "place_order", "reorder"])
        )
        .order_by(BehaviorEvent.created_at.desc())
        .limit(limit * 3)
        .all()
    )

    seen = set()
    item_ids = []
    for row in rows:
        if row.menu_item_id not in seen:
            seen.add(row.menu_item_id)
            item_ids.append(row.menu_item_id)
        if len(item_ids) == limit:
            break

    if not item_ids:
        return []

    items = db.query(MenuItem).filter(MenuItem.id.in_(item_ids)).all()

    result = []
    for item in items:
        result.append({
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "price": float(item.price),
            "category": item.category,
            "reason": "Based on your recent activity",
            "type": "recent",
            "confidence": "Medium"
        })

    return result


def get_time_based_items(db: Session, limit: int = 5):
    category = get_time_based_category()

    items = (
        db.query(MenuItem)
        .filter(
            MenuItem.category == category,
            MenuItem.is_available == True
        )
        .limit(limit)
        .all()
    )

    result = []
    for item in items:
        result.append({
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "price": float(item.price),
            "category": item.category,
            "reason": f"Recommended for {category.lower()} time",
            "type": "time_based",
            "confidence": "Medium"
        })

    return result


def get_home_recommendations(db: Session, user_id: int):
    frequent = get_frequent_items(db, user_id)
    recent = get_recent_items(db, user_id)
    time_based = get_time_based_items(db)

    sections = {
        "predicted_for_you": frequent,
        "recent_activity": recent,
        "time_based": time_based
    }

    cleaned_sections = remove_duplicates_from_all(sections)

    return cleaned_sections
def get_instant_suggestion(db: Session, user_id: int):
    home_data = get_home_recommendations(db, user_id)

    for section in ["predicted_for_you", "recent_activity", "time_based"]:
        if home_data.get(section):
            best_item = home_data[section][0]
            return {
                "id": best_item["id"],
                "name": best_item["name"],
                "description": best_item["description"],
                "price": best_item["price"],
                "category": best_item["category"],
                "reason": best_item["reason"],
                "type": best_item["type"],
                "confidence": best_item.get("confidence", "Medium")
            }

    return None
def get_trending_items(db: Session, limit: int = 6):
    rows = (
        db.query(
            BehaviorEvent.menu_item_id,
            func.count(BehaviorEvent.menu_item_id).label("score")
        )
        .filter(
            BehaviorEvent.menu_item_id.isnot(None),
            BehaviorEvent.event_type.in_(["add_to_cart", "place_order", "reorder"])
        )
        .group_by(BehaviorEvent.menu_item_id)
        .order_by(func.count(BehaviorEvent.menu_item_id).desc())
        .limit(limit)
        .all()
    )

    item_ids = [row.menu_item_id for row in rows]
    if not item_ids:
        return []

    items = db.query(MenuItem).filter(MenuItem.id.in_(item_ids)).all()

    result = []
    for item in items:
        result.append({
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "price": float(item.price),
            "category": item.category,
            "reason": "Trending among users right now",
            "type": "trending",
            "confidence": "High"
        })

    return result