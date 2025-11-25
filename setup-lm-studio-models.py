#!/usr/bin/env python3
"""
LM Studio Model Setup Helper voor M4 MacBook Pro
Dit script helpt bij het configureren van modellen in LM Studio en Cursor
"""

import json
import subprocess
import sys
import requests
from pathlib import Path

LM_STUDIO_URL = "http://localhost:1234/v1"

# Aanbevolen modellen voor 36GB RAM
RECOMMENDED_MODELS = {
    "qwen-32b": {
        "name": "Qwen2.5-Coder-32B-Instruct",
        "file": "Q5_K_M.gguf",
        "size_gb": 18,
        "use": "Primaire code generatie en debugging",
        "priority": 1
    },
    "deepseek-70b": {
        "name": "DeepSeek-R1-Distill-Llama-70B",
        "file": "Q4_K_M.gguf",
        "size_gb": 35,
        "use": "Complexe bugs en redeneren",
        "priority": 2
    },
    "phi-3.5-mini": {
        "name": "Phi-3.5-mini-instruct",
        "file": "Q8_0.gguf",
        "size_gb": 4,
        "use": "Snelle vragen en code uitleg",
        "priority": 3
    }
}

def check_lm_studio():
    """Check of LM Studio server draait"""
    try:
        response = requests.get(f"{LM_STUDIO_URL}/models", timeout=2)
        if response.status_code == 200:
            return True, response.json()
        return False, None
    except requests.exceptions.RequestException:
        return False, None

def list_available_models():
    """Lijst alle beschikbare modellen op de server"""
    try:
        response = requests.get(f"{LM_STUDIO_URL}/models", timeout=5)
        if response.status_code == 200:
            data = response.json()
            return data.get("data", [])
        return []
    except requests.exceptions.RequestException as e:
        print(f"❌ Fout bij ophalen modellen: {e}")
        return []

def print_recommendations():
    """Print aanbevelingen voor te downloaden modellen"""
    print("\n" + "="*60)
    print("📥 AANBEVOLEN MODELLEN VOOR DOWNLOAD IN LM STUDIO")
    print("="*60)
    print(f"\nJe hebt 36GB RAM - perfect voor deze modellen!\n")
    
    for key, model in sorted(RECOMMENDED_MODELS.items(), key=lambda x: x[1]["priority"]):
        print(f"\n{model['priority']}. {model['name']}")
        print(f"   📦 Bestand: {model['file']}")
        print(f"   💾 Grootte: ~{model['size_gb']}GB")
        print(f"   🎯 Gebruik: {model['use']}")
        print(f"   🔍 Zoekterm in LM Studio: {model['name']}")

def print_instructions():
    """Print download instructies"""
    print("\n" + "="*60)
    print("📋 DOWNLOAD INSTRUCTIES")
    print("="*60)
    print("""
1. Open LM Studio applicatie
2. Ga naar "Search" tabblad (vergrootglas icoon)
3. Voor elk model:
   a. Typ de zoekterm in de zoekbalk
   b. Klik op het model
   c. Scroll naar "Available Files"
   d. Kies het aanbevolen bestand (Q5_K_M, Q4_K_M, of Q8_0)
   e. Klik "Download"
4. Wacht tot alle downloads klaar zijn
5. Start de server in LM Studio (Local Server tab → Start Server)
6. Run dit script opnieuw om te verifiëren
    """)

def create_cursor_config():
    """Maak configuratiebestand voor Cursor"""
    config = {
        "lm_studio": {
            "base_url": "http://localhost:1234/v1",
            "models": {}
        },
        "cursor_settings": {
            "openai_api_base_url": "http://localhost:1234/v1",
            "models": []
        }
    }
    
    # Voeg modellen toe aan config
    models = list_available_models()
    for model in models:
        model_id = model.get("id", "")
        if any(key in model_id.lower() for key in ["qwen", "deepseek", "phi"]):
            config["cursor_settings"]["models"].append({
                "name": model_id,
                "display_name": model_id.replace("-", " ").title()
            })
    
    config_path = Path(__file__).parent / "lm-studio-cursor-config.json"
    with open(config_path, "w") as f:
        json.dump(config, f, indent=2)
    
    print(f"\n✅ Configuratie opgeslagen in: {config_path}")
    return config_path

def main():
    print("🚀 LM Studio Setup Helper voor M4 MacBook Pro")
    print("="*60)
    
    # Check LM Studio status
    is_running, models_data = check_lm_studio()
    
    if not is_running:
        print("\n❌ LM Studio server is NIET actief")
        print("\n📝 Start eerst LM Studio:")
        print("   1. Open LM Studio applicatie")
        print("   2. Ga naar 'Local Server' tab")
        print("   3. Selecteer een model")
        print("   4. Zet CORS aan")
        print("   5. Klik 'Start Server'")
        print("\n💡 Daarna run dit script opnieuw!")
        sys.exit(1)
    
    print("\n✅ LM Studio server is actief!")
    
    # Lijst beschikbare modellen
    models = list_available_models()
    if models:
        print(f"\n📋 Gevonden {len(models)} model(en) op de server:")
        for model in models:
            model_id = model.get("id", "unknown")
            print(f"   - {model_id}")
    else:
        print("\n⚠️  Geen modellen gevonden op de server")
    
    # Print aanbevelingen
    print_recommendations()
    
    # Check of aanbevolen modellen al gedownload zijn
    model_ids = [m.get("id", "").lower() for m in models]
    missing_models = []
    
    for key, model in RECOMMENDED_MODELS.items():
        model_name_lower = model["name"].lower()
        found = any(model_name_lower in mid for mid in model_ids)
        if not found:
            missing_models.append(model)
    
    if missing_models:
        print("\n" + "="*60)
        print("⚠️  ONTBREKENDE MODELLEN")
        print("="*60)
        for model in missing_models:
            print(f"\n❌ {model['name']} - Nog niet gedownload")
        print_instructions()
    else:
        print("\n" + "="*60)
        print("✅ ALLE AANBEVOLEN MODELLEN ZIJN GEDOWNLOAD!")
        print("="*60)
    
    # Maak Cursor config
    print("\n" + "="*60)
    print("⚙️  CURSOR CONFIGURATIE")
    print("="*60)
    config_path = create_cursor_config()
    
    print("\n📝 Volgende stappen voor Cursor:")
    print("   1. Open Cursor Settings (Cmd + ,)")
    print("   2. Ga naar Features → Models")
    print("   3. Zet 'OpenAI API Base URL' op: http://localhost:1234/v1")
    print("   4. Voeg modellen toe via '+ Add Model'")
    print("   5. Gebruik in chat via model dropdown")
    
    print("\n✅ Setup compleet! Check lm-studio-cursor-config.json voor details.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Gestopt door gebruiker")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Fout: {e}")
        sys.exit(1)

