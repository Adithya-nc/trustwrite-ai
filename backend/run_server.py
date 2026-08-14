import os
import sys
import socket
import urllib.request
import subprocess

def is_port_in_use(host: str, port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(1.0)
        return s.connect_ex((host, port)) == 0

def check_existing_health(url: str) -> bool:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'HealthCheck'})
        with urllib.request.urlopen(req, timeout=2) as resp:
            return resp.status == 200
    except Exception:
        return False

def kill_process_on_port(port: int):
    try:
        out = subprocess.check_output(f"netstat -ano | findstr :{port}", shell=True).decode()
        pids = set()
        for line in out.strip().splitlines():
            parts = line.split()
            if len(parts) >= 5 and "LISTENING" in parts[3]:
                pids.add(parts[4])
        for pid in pids:
            if pid and pid != "0":
                print(f"Terminating process on port {port} (PID {pid})...")
                subprocess.run(f"taskkill /F /PID {pid}", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception:
        pass

def main():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)

    host = "127.0.0.1"
    port = 8000

    if is_port_in_use(host, port):
        health_url = f"http://{host}:{port}/api/health"
        if check_existing_health(health_url):
            print(f"[OK] TrustWrite AI Backend Server is ALREADY running at http://{host}:{port}")
            print(f"Health check verified: {health_url}")
            return
        else:
            print(f"[WARNING] Port {port} is occupied by an inactive process. Releasing port...")
            kill_process_on_port(port)

    venv_python = os.path.join(backend_dir, "venv", "Scripts", "python.exe")
    python_bin = venv_python if os.path.exists(venv_python) else sys.executable

    cmd = [python_bin, "-m", "uvicorn", "app.main:app", "--host", host, "--port", str(port), "--reload"]
    print(f"Starting Backend API on http://{host}:{port}...")
    try:
        subprocess.run(cmd)
    except KeyboardInterrupt:
        print("\nBackend server stopped.")

if __name__ == '__main__':
    main()
