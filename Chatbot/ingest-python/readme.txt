

Check the health of the endpoint 

curl -X GET http://localhost:8000/health

How to test from windows host NEED to use COMMAND PROMPT, not powershell 

curl -X POST -F "file=@filenameofthepdf.pdf" http://localhost:8000/ingest/pdf

H:\Data\githubrepo\dockers\Chatbot\ingest-python\samplepdf>curl -X POST -F "file=@labourchief.pdf" http://localhost:8000/ingest/pdf
{"filename":"labourchief.pdf","inserted_chunks":5,"message":"Inserted 5 chunks from labourchief.pdf"}
H:\Data\githubrepo\dockers\Chatbot\ingest-python\samplepdf>


H:\Data\githubrepo\dockers\Chatbot\ingest-python\samplepdf>curl -X POST -F "file=@Iran protesters defy crackdown as Tehran warns against potential US involvement.pdf" http://localhost:8000/ingest/pdf
{"filename":"labourchief.pdf","inserted_chunks":5,"message":"Inserted 5 chunks from labourchief.pdf"}
H:\Data\githubrepo\dockers\Chatbot\ingest-python\samplepdf>