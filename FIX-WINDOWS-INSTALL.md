# Fix for Windows npm install EPERM Error

## Problem
You're seeing this error:
```
npm error code EPERM
npm error syscall spawn
npm error errno -4048
```

This is a common Windows issue where files are locked by another process.

## Solution - Option 1: PowerShell Script (Recommended)

1. **Close all terminals** and any processes that might be using Node.js
2. **Run the fix script**:
   ```powershell
   .\install-fix.ps1
   ```
3. **Then install**:
   ```powershell
   npm install
   ```
4. **Run the app**:
   ```powershell
   npm run dev
   ```

## Solution - Option 2: Manual Steps

1. **Close all terminals**
2. **Open Task Manager** (Ctrl+Shift+Esc)
3. **End these processes** if running:
   - node.exe
   - npm.exe
4. **Delete these manually**:
   - `node_modules` folder (delete the whole folder)
   - `package-lock.json` file
5. **Reopen terminal and run**:
   ```powershell
   npm install
   npm run dev
   ```

## Solution - Option 3: Use Yarn Instead

If npm continues to fail, use Yarn which handles Windows file locks better:

```powershell
# Install Yarn globally
npm install -g yarn

# Use Yarn to install
yarn install

# Run the app
yarn dev
```

## Solution - Option 4: Run as Administrator

1. **Right-click PowerShell** and select **"Run as Administrator"**
2. **Navigate to project**:
   ```powershell
   cd C:\Users\mrjoj\inventory
   ```
3. **Run the fix script**:
   ```powershell
   .\install-fix.ps1
   ```
4. **Install and run**:
   ```powershell
   npm install
   npm run dev
   ```

## Still Having Issues?

### Disable Antivirus Temporarily
Sometimes antivirus software locks files. Try temporarily disabling it during installation.

### Restart Your Computer
A fresh start can release locked files.

### Check for Background Processes
Make sure no code editors or terminals have the project open.

## After Installation Works

Once `npm install` completes successfully:

1. **Update `.env.local`** with your Supabase credentials
2. **Run the app**: `npm run dev`
3. **Open**: http://localhost:3000
4. **Follow the setup guide** in `QUICK-START.md`

## Need More Help?

Check these files for complete setup instructions:
- `QUICK-START.md` - 5-minute setup guide
- `SETUP-GUIDE.md` - Detailed instructions
- `PROJECT-SUMMARY.md` - Complete overview
