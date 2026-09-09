import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

def test_pencil_design_specification():
    """Verify that design/mochi-pet.pen exists and matches the Pencil schema version 2.17"""
    pen_file = BASE_DIR / "design" / "mochi-pet.pen"
    assert pen_file.exists(), "design/mochi-pet.pen must exist"
    
    with open(pen_file, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    assert data.get("version") == "2.17"
    assert "variables" in data
    assert "children" in data
    assert len(data["children"]) > 0
    
    # Check that main companion screen exists
    screen_ids = [child.get("id") for child in data["children"]]
    assert "screen_main_companion" in screen_ids
    
    # Check OLED color variables
    variables = data["variables"]
    assert "oled-cyan" in variables
    assert "oled-amber" in variables
    assert "oled-pink" in variables

def test_docker_compose_traefik_configuration():
    """Verify docker-compose.yml defines the Traefik routing rules and web_proxy network"""
    compose_file = BASE_DIR / "docker-compose.yml"
    assert compose_file.exists(), "docker-compose.yml must exist"
    
    content = compose_file.read_text()
    assert "traefik.enable=true" in content
    assert "traefik.http.routers.dasai-mochi.entrypoints=websecure" in content
    assert "Host(`${APP_DOMAIN:-mochi.masmuf.cloud}`)" in content
    assert "traefik.http.routers.dasai-mochi.tls.certresolver=${TRAEFIK_CERTRESOLVER:-myresolver}" in content
    assert "web_proxy" in content

def test_env_files_and_defaults():
    """Verify .env and .env.example contain required keys and match mochi.masmuf.cloud"""
    env_example = BASE_DIR / ".env.example"
    env_file = BASE_DIR / ".env"
    
    assert env_example.exists()
    assert env_file.exists()
    
    assert "APP_DOMAIN=mochi.masmuf.cloud" in env_example.read_text()
    assert "APP_DOMAIN=mochi.masmuf.cloud" in env_file.read_text()

def test_nginx_and_dockerfile():
    """Verify Dockerfile and nginx SPA configuration"""
    dockerfile = BASE_DIR / "Dockerfile"
    nginx_conf = BASE_DIR / "nginx.conf"
    
    assert dockerfile.exists()
    assert nginx_conf.exists()
    
    df_content = dockerfile.read_text()
    assert "FROM node" in df_content
    assert "FROM python" in df_content
    assert "EXPOSE 80" in df_content
    
    ng_content = nginx_conf.read_text()
    assert "try_files $uri $uri/ /index.html" in ng_content
    assert "gzip on;" in ng_content

def test_frontend_production_build_artifacts():
    """Verify dist directory contains built index.html and assets"""
    dist_dir = BASE_DIR / "dist"
    index_html = dist_dir / "index.html"
    
    assert dist_dir.exists(), "dist/ directory must exist after build"
    assert index_html.exists(), "dist/index.html must exist"
    
    html_content = index_html.read_text()
    assert "<!doctype html>" in html_content.lower()
    assert "assets/" in html_content
