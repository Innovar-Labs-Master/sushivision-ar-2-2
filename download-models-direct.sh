#!/bin/bash

# Directe Download Script voor LM Studio Modellen
# Dit script downloadt de modellen rechtstreeks van Hugging Face naar je LM Studio map

LM_STUDIO_DIR="/Users/innovarslabo/.lmstudio/models"

echo "🚀 LM Studio Direct Downloader"
echo "=============================="
echo "Doelmap: $LM_STUDIO_DIR"
echo ""

# Functie om te downloaden
download_model() {
    local publisher=$1
    local repo=$2
    local file=$3
    local url="https://huggingface.co/$publisher/$repo/resolve/main/$file"
    
    # Maak mapstructuur: publisher/repo
    local target_dir="$LM_STUDIO_DIR/$publisher/$repo"
    mkdir -p "$target_dir"
    
    local target_file="$target_dir/$file"
    
    echo "⬇️  Downloaden: $repo ($file)"
    echo "    URL: $url"
    echo "    Naar: $target_file"
    
    if [ -f "$target_file" ]; then
        echo "⚠️  Bestand bestaat al. Sla over."
    else
        # Download met curl en toon voortgang
        curl -L -o "$target_file" "$url" --progress-bar
        
        if [ $? -eq 0 ]; then
            echo "✅ Download compleet!"
        else
            echo "❌ Download mislukt!"
            rm "$target_file" # Verwijder corrupt bestand
        fi
    fi
    echo ""
}

# 1. Phi-3.5 Mini (Snel & Klein - ~4GB)
# Perfect om te testen
echo "--- 1. Downloaden Phi-3.5 Mini (Snel) ---"
download_model "bartowski" "Phi-3.5-mini-instruct-GGUF" "Phi-3.5-mini-instruct-Q8_0.gguf"

# 2. Qwen2.5 Coder 32B (De Expert - ~20GB)
# Het beste code model
echo "--- 2. Downloaden Qwen2.5 Coder 32B (Code Expert) ---"
# We gebruiken Q4_K_M om het iets kleiner te houden (rond 19GB)
download_model "bartowski" "Qwen2.5-Coder-32B-Instruct-GGUF" "Qwen2.5-Coder-32B-Instruct-Q4_K_M.gguf"

# 3. DeepSeek R1 (Redeneren - Kleinere versie voor veiligheid)
# We kiezen de 8B of 14B versie om te voorkomen dat je 40GB downloadt en het te lang duurt
# Als je echt de 70B wilt, kun je dat later doen. Laten we beginnen met een beheersbare DeepSeek.
echo "--- 3. Downloaden DeepSeek R1 (Redeneren) ---"
download_model "bartowski" "DeepSeek-R1-Distill-Llama-8B-GGUF" "DeepSeek-R1-Distill-Llama-8B-Q6_K.gguf"

echo "=============================="
echo "🎉 Alle downloads zijn gestart/klaar!"
echo ""
echo "Volgende stappen:"
echo "1. Herstart LM Studio (volledig afsluiten en opnieuw openen)"
echo "2. Ga naar het 'Chat' of 'Local Server' tabblad"
echo "3. Je zou de modellen nu bovenaan in de lijst moeten zien"

