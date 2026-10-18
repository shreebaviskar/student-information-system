# ==============================================================================
# Dockerfile for Student Information System (ASDD Mini Project)
# Containerized static website using lightweight official Nginx Alpine image
# ==============================================================================

# Base image: Official lightweight Nginx image on Alpine Linux (~25MB)
FROM nginx:alpine

# Metadata labels
LABEL maintainer="ASDD Student Project" \
      project="Student Information System" \
      version="1.0" \
      description="Static student management web application served via Nginx"

# Remove default Nginx welcome site
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy application static files into Nginx default document root
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Expose HTTP port 80 inside the container
EXPOSE 80

# Start Nginx server in the foreground (daemon off)
CMD ["nginx", "-g", "daemon off;"]
