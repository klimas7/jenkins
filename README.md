## [Materiały do pobrania](https://drive.google.com/drive/folders/1l8nAP_4hHqrliGPWCv8RHH6_SnM1-kA-?usp=sharing)
```
sha1sum
51bb48ecdfb4ce210f1941e43eebe674fb524b91  Jenkins_workshop_5.ova
3c6bff4eea93c387bbdf193015cda7c04833e75f  logger-plugin.hpi
a9fa67ec8bb023cf0d99eccd47b9cca96b433500  old-data-plugin.hpi
9d97f5492b3ba5c9cc502b3e26aa4b93a1c32ec5  old-data-plugin_v2.hpi
```
## Instalacja virtualnej maszyny
***Wymagania*** Zainstalowany [Virtual Box](https://www.virtualbox.org/wiki/Downloads)

W VM VirtualBox Manager wybieramy: Plik -> Importuj urządzenie wirtualne

W kolejnym oknie wybieramy pobrany obraz

![Import](img/import_1.png)

W kolejnym oknie należy zwrócić uwagę na dwie opcje
* Ilość pamięci (jeżeli nie mamy za dużo to można zmniejszyć do 2G)
* Wybrać opcje: **Generate new MAC addresses ...**

![Import](img/import_2.png)

Po zaimportowaniu i uruchomieniu powinniśmy otrzymać

![Import](img/import_3.png)

Proszę, zwrócić uwagę na przydzielony adres IP powinien to być w waszej sieci, a nie adres localhost (127.0.0.1)!

Użytkownicy:
```
jenkins:12345678
root:12345678
```
Można się zalogować bezpośrednio w oknie powyżej lub uzywając putty lub innego kliennta ssh
(np git Bash)
```
ssh root@192.168.0.178
or
ssh jenkins@192.168.0.178
```
## Temat 1: Uruchomienie 
### Instalacja via dnf
Definicja repozytorium i import klucza
```
# wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat/jenkins.repo
# rpm --import https://pkg.jenkins.io/redhat/jenkins.io.key
```
Instalacja
```
# dnf install jenkins
# dnf install java
```
Uruchomienie serwisu
```
# systemctl status jenkins.service
# systemctl enable jenkins.service
# systemctl start jenkins.service
```
Test: [http://192.168.0.178:8080/](http://192.168.0.178:8080/) otwieramy w przeglądarce

Firewall
```
# firewall-cmd --permanent --add-service=jenkins
# firewall-cmd --zone=public --add-service=http --permanent
# firewall-cmd --reload
# firewall-cmd --list-all
```
Test [http://192.168.0.178:8080/](http://192.168.0.178:8080/) otwieramy w przeglądarce

Usunięcie
```
# systemctl stop jenkins.service
# dnf remove jenkins
```
### Docker
```
$ docker pull jenkins/jenkins
# check version
$ docker image inspect docker.io/jenkins/jenkins
# start
$ docker run -d -v jenkins_home:/var/jenkins_home --name jenkins_workshop -p 8080:8080 -p 50000:50000 jenkins/jenkins &
$ docker ps
```
Test [http://192.168.0.178:8080/](http://192.168.0.178:8080/) otwieramy w przeglądarce
```
$ docker exec jenkins_workshop cat /var/jenkins_home/secrets/initialAdminPassword
```
Stop and clean
```
$ docker stop jenkins_workshop
$ docker rm jenkins_workshop
$ docker volume rm jenkins_home
```
### Uruchomienie via jar
```
$ cd /opt/tools/jenkins
$ java -jar jenkins.war &
```
Test [http://192.168.0.178:8080/](http://192.168.0.178:8080/) otwieramy w przeglądarce
Stop and clean
```shell script
$ ps aux | grep java
$ kill -9 1338 #JENKINS_PID
# or
$ killall java

rm -rf ~/.jenkins
```
### Uruchomienie ze skryptu
 

### Ćwiczenie 1.1
### Ćwiczenie 1.2*
## Temat 2: Katalog domowy
### Instalacja via dnf
```
JENKINS_HOME=/var/lib/jenkins
logfile=/var/log/jenkins/jenkins.log
war=/usr/lib/jenkins/jenkins.war
```
### Instalacja via dnf
```
JENKINS_HOME=/home/jenkins/.jenkins
```
### Ćwiczenie 2.1: Odzyskanie dostępu

## Temat 4
## Temat 5
## Temat 6
## Temat 7
## Temat 8
## Temat 9
## Temat 10
## Temat 11
## Temat 12
## Temat 13
## Temat 14
## Temat 15
## Temat 16