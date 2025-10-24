# Use official nginx image as base
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY app/nginx.conf /etc/nginx/conf.d/default.conf

# Copy website files to nginx html directory
COPY app/index.html /usr/share/nginx/html/
COPY app/styles.css /usr/share/nginx/html/
COPY app/script.js /usr/share/nginx/html/

# Copy media folder with all media files
COPY app/media/ /usr/share/nginx/html/media/

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
