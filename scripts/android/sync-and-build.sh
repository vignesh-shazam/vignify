#!/usr/bin/env bash
# Build the mobile Vite bundle, sync Capacitor, then build the Android APK.
# Run from the monorepo root.
set -euo pipefail

echo "==> Building Vite mobile bundle..."
npm run build --workspace=apps/mobile

echo "==> Syncing Capacitor assets..."
cd apps/mobile && npx cap sync android && cd ../..

echo "==> Building Android APK..."
cd apps/mobile/android && ./gradlew assembleDebug && cd ../../..

echo ""
echo "APK output: apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk"
