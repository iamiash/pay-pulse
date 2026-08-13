from typing import Dict, Any, List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db.models import Subscription, WalletCard, WalletBank, WalletMobile

def get_analytics_metrics(
    db: Session, 
    user_id: int, 
    period: str = "This Month", 
    start_date: str = None, 
    end_date: str = None
) -> Dict[str, Any]:
    query = db.query(Subscription).filter(Subscription.user_id == user_id)
    all_subs: List[Subscription] = query.all()
    
    active_subs = [s for s in all_subs if (s.status or "").lower() == "active"]
    
    monthly_costs = []
    annual_costs = []
    for s in active_subs:
        cost = float(s.cost or 0.0)
        cycle = (s.billing_cycle or "Monthly").lower()
        if cycle == "yearly":
            m_cost = cost / 12.0
            a_cost = cost
        elif cycle == "quarterly":
            m_cost = cost / 3.0
            a_cost = cost * 4.0
        elif cycle == "half-yearly":
            m_cost = cost / 6.0
            a_cost = cost * 2.0
        elif cycle == "weekly":
            m_cost = cost * 4.33
            a_cost = cost * 52.0
        else:
            m_cost = cost
            a_cost = cost * 12.0

        monthly_costs.append(m_cost)
        annual_costs.append(a_cost)

    avg_monthly_spending = sum(monthly_costs) if monthly_costs else 0.0
    total_annual_spending = sum(annual_costs) if annual_costs else 0.0
    
    if period == "This Year":
        total_spending = total_annual_spending
    elif period == "Last 3 Months":
        total_spending = avg_monthly_spending * 3.0
    elif period == "Custom" and start_date and end_date:
        total_spending = avg_monthly_spending
    else:
        total_spending = avg_monthly_spending

    highest_sub = max(active_subs, key=lambda s: s.cost or 0.0, default=None)
    highest_sub_data = {
        "name": highest_sub.name if highest_sub else "None",
        "cost": float(highest_sub.cost) if highest_sub else 0.0,
        "category": highest_sub.category if highest_sub else "N/A"
    }

    potential_annual_savings = sum(
        (s.cost * 12.0 * 0.15) for s in active_subs if (s.billing_cycle or "Monthly").lower() == "monthly"
    )

    today = datetime.now()
    months_labels = []
    for i in range(5, -1, -1):
        dt = today - timedelta(days=i*30)
        months_labels.append(dt.strftime("%b"))
        
    spending_over_time = []
    base_val = avg_monthly_spending if avg_monthly_spending > 0 else 0.0
    multipliers = [0.82, 0.88, 0.91, 0.95, 0.98, 1.0]
    for idx, month in enumerate(months_labels):
        spending_over_time.append({
            "month": month,
            "amount": round(base_val * multipliers[idx], 2)
        })

    cat_totals: Dict[str, float] = {
        "AI": 0.0,
        "Entertainment": 0.0,
        "Cloud": 0.0,
        "Software": 0.0,
        "Education": 0.0,
        "Other": 0.0
    }
    
    for s in active_subs:
        cat = (s.category or "Other").strip()
        matched = False
        for key in cat_totals.keys():
            if key.lower() in cat.lower():
                cat_totals[key] += float(s.cost or 0.0)
                matched = True
                break
        if not matched:
            cat_totals["Other"] += float(s.cost or 0.0)

    total_cat_sum = sum(cat_totals.values()) or 1.0
    spending_by_category = [
        {
            "category": k,
            "amount": round(v, 2),
            "percentage": round((v / total_cat_sum) * 100, 1) if v > 0 else 0
        }
        for k, v in cat_totals.items()
    ]

    cycles_count = {"Monthly": 0, "Yearly": 0, "Quarterly": 0}
    for s in active_subs:
        c = (s.billing_cycle or "Monthly").capitalize()
        if c in cycles_count:
            cycles_count[c] += 1
        else:
            cycles_count["Monthly"] += 1
            
    billing_cycle_distribution = [
        {"cycle": k, "count": v} for k, v in cycles_count.items()
    ]

    source_count = {"Card": 0, "Bank": 0, "Mobile Banking": 0}
    for s in active_subs:
        pt = (s.payment_type or "Card").lower()
        if "card" in pt:
            source_count["Card"] += 1
        elif "bank" in pt:
            source_count["Bank"] += 1
        elif "mobile" in pt or "mfs" in pt or "bkash" in pt or "nagad" in pt:
            source_count["Mobile Banking"] += 1
        else:
            source_count["Card"] += 1

    payment_source_distribution = [
        {"source": k, "count": v} for k, v in source_count.items()
    ]

    ai_subs = [s.name for s in active_subs if "ai" in (s.category or "").lower() or s.name.lower() in ["chatgpt", "claude", "gemini", "perplexity"]]

    sorted_subs = sorted(active_subs, key=lambda x: x.cost or 0.0, reverse=True)
    top_3 = sorted_subs[:3]
    top_3_sum = sum(s.cost or 0.0 for s in top_3)
    top_3_pct = round((top_3_sum / (sum(s.cost or 0.0 for s in active_subs) or 1.0)) * 100) if active_subs else 0

    next_30_days_spending = sum(
        s.cost or 0.0 for s in active_subs if (s.billing_cycle or "Monthly").lower() == "monthly"
    )

    smart_savings = {
        "similar_subscriptions": {
            "category": "AI Tools",
            "items": ai_subs
        },
        "high_cost_subscriptions": {
            "top_count": len(top_3),
            "percentage_of_total": top_3_pct,
            "top_names": [s.name for s in top_3] if top_3 else []
        },
        "annual_billing_opportunity": {
            "estimated_annual_savings": potential_annual_savings
        },
        "upcoming_spending_30_days": round(next_30_days_spending, 2)
    }

    return {
        "period": period,
        "metrics": {
            "total_spending": round(total_spending, 2),
            "average_monthly_spending": round(avg_monthly_spending, 2),
            "total_annual_spending": round(total_annual_spending, 2),
            "highest_subscription": highest_sub_data,
            "active_subscriptions_count": len(active_subs),
            "potential_savings": round(potential_annual_savings, 2)
        },
        "charts": {
            "spending_over_time": spending_over_time,
            "spending_by_category": spending_by_category,
            "billing_cycle_distribution": billing_cycle_distribution,
            "payment_source_distribution": payment_source_distribution
        },
        "smart_savings": smart_savings
    }