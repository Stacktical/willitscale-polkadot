FROM r-base:3.5.3

ADD install-packages.R install-packages.R

ADD run-rserve.R run-rserve.R

RUN Rscript install-packages.R

ADD Rserv.conf /etc/Rserv.conf

EXPOSE 6311

RUN touch /rserve.log

CMD Rscript run-rserve.R
