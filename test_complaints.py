import requests
import json
import time

API_URL = "http://localhost:8000/api"

def login():
    res = requests.post(f"{API_URL}/auth/token", data={
        "username": "client@civicflow.com",
        "password": "client123"
    })
    return res.json()["access_token"]

def main():
    token = login()
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    complaints = [
        {"title": "Exposed electrical wire near a school", "description": "There is a live wire hanging near the elementary school.", "category": "Safety"},
        {"title": "Large garbage accumulation blocking part of the road", "description": "Trash bags are spilling over into the street causing a blockade.", "category": "Sanitation"},
        {"title": "Street light not working", "description": "The lamp on 5th avenue is out.", "category": "Infrastructure"}
    ]
    
    for i, c in enumerate(complaints):
        res = requests.post(f"{API_URL}/complaints/", headers=headers, json=c)
        data = res.json()
        print(f"Complaint {i+1}: {c['title']}")
        print(f"Risk Level: {data.get('riskLevel', 'NOT FOUND')}")
        print("-" * 30)

if __name__ == "__main__":
    main()
