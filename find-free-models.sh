#!/bin/bash

# Script om gratis sterke modellen te vinden op Hugging Face
# Gebruikt de Hugging Face API om modellen te zoeken die geschikt zijn voor LM Studio

# Gebruik environment variable of .env bestand
HF_TOKEN="${HF_API_TOKEN:-}"
HF_API="https://huggingface.co/api"

if [ -z "$HF_TOKEN" ]; then
    echo "⚠️  Waarschuwing: HF_API_TOKEN niet ingesteld"
    echo "   Zet je token: export HF_API_TOKEN='jouw_token'"
    echo "   Of voeg toe aan .env bestand"
fi

echo "🔍 Zoeken naar gratis sterke modellen op Hugging Face..."
echo "=========================================================="
echo ""

# Functie om modellen te zoeken
search_models() {
    local query=$1
    local type=$2
    
    echo "📦 Zoeken naar $type modellen..."
    
    curl -s -H "Authorization: Bearer $HF_TOKEN" \
        "$HF_API/models?search=$query&filter=gguf&sort=downloads&direction=-1&limit=10" \
        | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    if isinstance(data, list):
        for i, model in enumerate(data[:5], 1):
            if not model.get('gated', False):
                print(f\"  {i}. {model.get('id', 'unknown')}\")
                print(f\"     Downloads: {model.get('downloads', 0):,}\")
                print(f\"     Likes: {model.get('likes', 0)}\")
                print(f\"     Tags: {', '.join(model.get('tags', [])[:3])}\")
                print(\"\")
except Exception as e:
    print(f\"Error: {e}\")
" 2>/dev/null || echo "  Kon geen modellen vinden"
}

echo "💻 PROGRAMMEER MODELLEN"
echo "----------------------"
search_models "coder" "code"
echo ""

echo "🐛 DEBUG MODELLEN"
echo "----------------"
search_models "instruct" "instruct"
echo ""

echo "🎯 AANBEVOLEN MODELLEN (Gratis & Sterk)"
echo "======================================="
echo ""
echo "Voor Programmeren:"
echo "  1. Qwen/Qwen2.5-Coder-32B-Instruct (Beste code model)"
echo "  2. deepseek-ai/DeepSeek-Coder-6.7B-Instruct (Goed alternatief)"
echo "  3. codellama/CodeLlama-13B-Instruct (Betrouwbaar)"
echo ""
echo "Voor Debugging:"
echo "  1. microsoft/Phi-3.5-mini-instruct (Snel en slim)"
echo "  2. mistralai/Mistral-7B-Instruct-v0.2 (Goede balans)"
echo "  3. microsoft/Phi-3-mini-instruct (Zeer snel)"
echo ""
echo "💡 Tip: Gebruik TypeScript script voor gedetailleerde analyse:"
echo "   npx ts-node find-free-models.ts"
echo ""

