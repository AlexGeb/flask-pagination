FROM python:3.6-alpine
COPY backend/requirements.txt /
RUN pip install -r requirements.txt
COPY backend/ /app
WORKDIR /app
CMD ["gunicorn", "-w 4", "app:app"]