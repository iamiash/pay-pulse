import json
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.db.models import AuditLog

def sanitize_metadata(data: Optional[Dict[str, Any]]) -> Optional[str]:
    if not data:
        return None
    
    clean_dict = {}
    sensitive_keys = {"password", "cvc", "card_number", "access_token", "reset_token", "current_password", "new_password"}
    
    for key, value in data.items():
        if key.lower() in sensitive_keys:
            clean_dict[key] = "[REDACTED]"
        else:
            clean_dict[key] = value
            
    try:
        return json.dumps(clean_dict)
    except Exception:
        return str(clean_dict)

def log_audit_event(
    db: Session,
    action: str,
    resource_type: str,
    user_id: Optional[int] = None,
    actor_user_id: Optional[int] = None,
    resource_id: Optional[str] = None,
    ip_address: Optional[str] = "127.0.0.1",
    user_agent: Optional[str] = "PayPulse App",
    status: str = "SUCCESS",
    metadata: Optional[Dict[str, Any]] = None
) -> Optional[AuditLog]:
    try:
        log_entry = AuditLog(
            user_id=user_id,
            actor_user_id=actor_user_id or user_id,
            action=action,
            resource_type=resource_type,
            resource_id=str(resource_id) if resource_id else None,
            ip_address=ip_address,
            user_agent=user_agent,
            status=status,
            metadata_json=sanitize_metadata(metadata)
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        return log_entry
    except Exception as err:
        db.rollback()
        print(f"[Audit Log Error] Failed to persist audit record: {str(err)}")
        return None