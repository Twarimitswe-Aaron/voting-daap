import subprocess
import time

rpcs = [
    "https://rpc2.sepolia.org",
    "https://1rpc.io/sepolia",
    "https://ethereum-sepolia-rpc.publicnode.com",
    "https://gateway.tenderly.co/public/sepolia",
    "https://rpc.sepolia.org"
]

env_path = ".env"

def update_env(rpc):
    with open(env_path, 'r') as file:
        lines = file.readlines()
    
    with open(env_path, 'w') as file:
        for line in lines:
            if line.startswith("ALCHEMY_URL="):
                file.write(f'ALCHEMY_URL="{rpc}"\n')
            else:
                file.write(line)

for rpc in rpcs:
    print(f"\n[+] Testing RPC: {rpc}")
    update_env(rpc)
    
    # Run the Truffle migrate command
    result = subprocess.run(
        ["npx", "truffle", "migrate", "--network", "sepolia"],
        capture_output=True, text=True
    )
    
    print(result.stdout)
    if result.stderr:
        print(f"Errors/Warnings:\n{result.stderr}")
    
    if result.returncode == 0 and "Deploying" in result.stdout:
        print(f"\n[SUCCESS] Deployed successfully using RPC: {rpc}")
        break
    else:
        print(f"[FAILED] Moving to next RPC...\n")
        time.sleep(2) # Give it a second before retrying
