## Do pobrania 
[Google drive](https://drive.google.com/drive/folders/1l8nAP_4hHqrliGPWCv8RHH6_SnM1-kA-?usp=sharing)
```bash
sha1sum
51bb48ecdfb4ce210f1941e43eebe674fb524b91  Jenkins_workshop_5.ova
3c6bff4eea93c387bbdf193015cda7c04833e75f  logger-plugin.hpi
a9fa67ec8bb023cf0d99eccd47b9cca96b433500  old-data-plugin.hpi
9d97f5492b3ba5c9cc502b3e26aa4b93a1c32ec5  old-data-plugin_v2.hpi
```
## Instalacja wirtualnej maszyny
***Wymagania*** Zainstalowany [Virtual Box](https://www.virtualbox.org/wiki/Downloads)

W VM VirtualBox Manager wybieramy: Plik -> Importuj urządzenie wirtualne.

W kolejnym oknie wybieramy pobrany obraz.

![Import](img/import_1.png)

W kolejnym oknie należy zwrócić uwagę na dwie opcje.
* Ilość pamięci (jeżeli nie mamy za dużo to można zmniejszyć do 2G)
* Wybrać opcje: **Generate new MAC addresses ...**

![Import](img/import_2.png)

Po zaimportowaniu i uruchomieniu powinniśmy otrzymać.

![Import](img/import_3.png)

Proszę, zwrócić uwagę na przydzielony adres IP powinien to być w waszej sieci, a nie adres localhost (127.0.0.1)!

Użytkownicy:
```bash
jenkins:12345678
root:12345678
```
Można się zalogować bezpośrednio w oknie powyżej, używając programu putty lub innego klienta ssh
(np. git Bash).
```bash
ssh root@192.168.0.178
or
ssh jenkins@192.168.0.178
```
## 0: Środowisko
[//]: * \[LDAP]\(http://ovh.klimas7.pl/ldap/cmd.php)
[//]: * \[Bitbucket](http://ovh.klimas7.pl/bitbucket)
[//]: * ~~\[Jenkins](http://ovh.klimas7.pl/jenkins) (tylko do integracji z bitbucket)~~
* Każdy z uczestników dzięki LDAP ma konta na Bitbucket oraz Jenkins.
* Konwencja nazw użytkowników: pierwsza litera imienia + nazwisko bez polskich znaków diakrytycznych. Bogusław Klimas -> bklimas

Zanim przejdziemy do dalszych działań, należy wygenerować klucze ssh na naszej wirtualnej maszynie.
Następnie klucz publiczny przypisać do swojego konta w Bitbuckecie.
```bash
$ ssh-keygen -t rsa -C bklimas@acme.com

$ ll ~/.ssh/
razem 12
-rw-------. 1 jenkins jenkins 1843 11-15 10:08 id_rsa
-rw-r--r--. 1 jenkins jenkins  411 11-15 10:08 id_rsa.pub
-rw-r--r--. 1 jenkins jenkins  571 11-15 09:55 known_hosts

$ cat ~/.ssh/id_rsa.pub
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCzsDiyJ+4WZAwaYDVz43Zrm6RCxPTzFWXnUfuBdAx6BmM98gxnveU0k+AbiiF739ZTDKxmWHyBmgGKVMzrSYoldKAPvTii4X/FtQfdsUrvl3gL9E+UM2MJ3k+yaYS88RmfDH7TTYBAwvFYqP3+F7F9tX+Te2Purf/ZwU+r5ekPMP4gtkO9Pi1XtzdOAW2vDHrXm2QJqOQPa8Ppx6SalrLOnlCjo5RtpEIBhjTN3WkwhRYHxDZedTZE0YFyn8fNna4UlZiEhPaLRu6utykDTyfOOhFiONYj9naNzv0/wIAYgYAFreD5CCNZEVMKIYwuKlS9Tb0gyzpDQYBjNGAvks2v jenkins@localhost.localdomain
```
Bitbucket [SSH keys](http://ovh.klimas7.pl/bitbucket/plugins/servlet/ssh/account/keys)
![Keys 1](img/keys_1.png)
Dodatkowo na wirtualnej maszynie, jak i na naszym komputerze (zapis hosta do ~/.known_hosts)

Bardzo pomocnym będzie także wgranie swojego klucza (z konta, którego teraz używacie) 
publicznego do Bitbucketa (nie ma się co obawiać to klucz publiczny!)

```bash
cd /tmp
git clone ssh://git@ovh.klimas7.pl:7999/lab/learn.git

$ git clone ssh://git@ovh.klimas7.pl:7999/lab/learn.git
Cloning into 'learn'...
The authenticity of host '[ovh.klimas7.pl]:7999 ([51.89.23.232]:7999)' can't be established.
RSA key fingerprint is SHA256:N9yD+ozjLANIDbEfFL/zuqv1smd1sBY58NJOSakHjuo.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '[ovh.klimas7.pl]:7999,[51.89.23.232]:7999' (RSA) to the list of known hosts
```

## 1: Uruchomienie 
### Instalacja via dnf
Definicja repozytorium i import klucza
```bash
# wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat/jenkins.repo
# rpm --import https://pkg.jenkins.io/redhat/jenkins.io.key
```
Instalacja
```bash
# dnf install jenkins
# dnf install java
```
Uruchomienie serwisu
```bash
# systemctl status jenkins.service
# systemctl enable jenkins.service
# systemctl start jenkins.service
```
Test: [http://192.168.0.178:8080/](http://192.168.0.178:8080/) otwieramy w przeglądarce

Firewall
```bash
# firewall-cmd --permanent --add-service=jenkins
# firewall-cmd --zone=public --add-service=http --permanent
# firewall-cmd --reload
# firewall-cmd --list-all
```
Test [http://192.168.0.178:8080/](http://192.168.0.178:8080/) otwieramy w przeglądarce

Usunięcie
```bash
# systemctl stop jenkins.service
# dnf remove jenkins
```
### Docker
```bash
$ docker pull jenkins/jenkins
# check version
$ docker image inspect docker.io/jenkins/jenkins
# start
$ docker run -d -v jenkins_home:/var/jenkins_home --name jenkins_workshop -p 8080:8080 -p 50000:50000 jenkins/jenkins &
$ docker ps
```
Test [http://192.168.0.178:8080/](http://192.168.0.178:8080/) otwieramy w przeglądarce
```bash
$ docker exec jenkins_workshop cat /var/jenkins_home/secrets/initialAdminPassword
```
Stop and clean
```bash
$ docker stop jenkins_workshop
$ docker rm jenkins_workshop
$ docker volume rm jenkins_home
```
### Uruchomienie via jar
```bash
$ cd /opt/tools/jenkins
$ java -jar jenkins.war &
```
Test [http://192.168.0.178:8080/](http://192.168.0.178:8080/) otwieramy w przeglądarce

Stop and clean
```bash
$ ps aux | grep java
$ kill -9 1338 #JENKINS_PID
# or
$ killall java

rm -rf ~/.jenkins
```
### Uruchomienie ze skryptu
```bash
$ cd /opt/tools/jenkins/
$ ls
jenkins.sh  jenkins.war  ssh
```
```bash
$ cat jenkins.sh 
#!/bin/bash

jh=/opt/tools/jenkins
jp=8080
mkdir -p $jh/log
mkdir -p $jh/war

command=$1

printUsage() {
    echo "Usage:"
    echo "jenkins.sh start"
    echo "jenkins.sh stop"
}

start() {
    jenkins_options="--logfile=$jh/log/jenkins.log --webroot=$jh/war"
    jenkins_options="$jenkins_options --ajp13Port=-1 --debug=5 \ 
                    --handlerCountMax=100 --handlerCountMaxIdle=20"
    
    #use http
    jenkins_options="$jenkins_options --httpPort=$jp"
    
    #use_https
    #jenkins_options="$jenkins_options --httpPort=-1 --httpsPort=8443 \ 
                       --httpsCertificate=$jh/ssh/cert.pem  \
                       --httpsPrivateKey=$jh/ssh/key.pem"

    java -Dcom.sun.akuma.Daemon=daemonized -Djava.awt.headless=true -DJENKINS_HOME=$jh \ 
         -jar $jh/jenkins.war $jenkins_options &
}

stop() {
    jenkinsPID=$(ps aux | grep java | grep $jh | awk '{print $2}')
    echo "kill jenkins process PID: "$jenkinsPID
    kill -9 $jenkinsPID 2>&1 > /dev/null
}

case $command in
    "start")
        start
        ;;
    "stop")
        stop
        ;;
    *)
        printUsage
esac

```
[winstone](http://winstone.sourceforge.net/), 
[winstone 1](http://winstone.sourceforge.net/#commandLine), 
[ajp](https://tomcat.apache.org/connectors-doc-archive/jk2/common/AJPv13.html), 
[headless](https://www.oracle.com/technical-resources/articles/javase/headless.html), 
[com.sun.akuma](https://github.com/kohsuke/akuma/tree/master/src/main/java/com/sun/akuma), 
[Jenkins initial-settings](https://www.jenkins.io/doc/book/installing/initial-settings/)
```bash
$ ./jenkins.sh
```
Test [http://192.168.0.178:8080/](http://192.168.0.178:8080/) otwieramy w przeglądarce
#### uruchomienie https
[ssl files explanation](https://serverfault.com/questions/9708/what-is-a-pem-file-and-how-does-it-differ-from-other-openssl-generated-key-file)
```bash
cd /opt/tools/jenkins/ssh
$ openssl genrsa -out key.pem
Generating RSA private key, 2048 bit long modulus (2 primes)
..............................................+++++
..............+++++
e is 65537 (0x010001)

$ openssl req -new -key key.pem -out csr.pem
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [XX]:PL
State or Province Name (full name) []:Lesser Poland
Locality Name (eg, city) [Default City]:KRK
Organization Name (eg, company) [Default Company Ltd]:K7Soft            
Organizational Unit Name (eg, section) []:
Common Name (eg, your name or your server's hostname) []:192.168.0.178
Email Address []:admin@k7soft.pl

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:

#### Self-signed certificate ####
$ openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
Signature ok
subject=C = PL, ST = Lesser Poland, L = KRK, O = K7Soft, CN = 192.168.0.178, emailAddress = admin@k7soft.pl
Getting Private key
```
W ``jenkins.sh``
```bash
#use http
#jenkins_options="$jenkins_options --httpPort=$jp"

#use_https
jenkins_options="$jenkins_options --httpPort=-1 --httpsPort=8443 --httpsCertificate=$jh/ssh/cert.pem --httpsPrivateKey=$jh/ssh/key.pem"
```
A tu w logach
```bash
2020-10-30 11:55:00.779+0000 [id=1]     WARNING winstone.Logger#logInternal: Using the --httpsPrivateKey/--httpsCertificate 
options currently relies on unsupported APIs in the Oracle JRE.
Please use --httpsKeyStore and related options instead.
```
Create keystore
```bash
$ openssl pkcs12 -export -in cert.pem -inkey key.pem -out jenkins.p12 -name jenkins
Enter Export Password:
Verifying - Enter Export Password:

#Password: 12345678

$ keytool -importkeystore -deststorepass 12345678 -destkeypass 12345678 \
          -destkeystore jenkins.keystore -srckeystore jenkins.p12 \ 
          -srcstoretype PKCS12 -srcstorepass 12345678 -alias jenkins
Importing keystore jenkins.p12 to jenkins.keystore...

$ keytool -list -keystore jenkins.keystore 
Enter keystore password:  
Keystore type: PKCS12
Keystore provider: SUN

Your keystore contains 1 entry

jenkins, 30 paź 2020, PrivateKeyEntry, 
Certificate fingerprint (SHA-256): D9:9C:7F:85:C5:1C:D8:32:82:0A:70:8E:8E:CF:59:15:B9:22:A2:9B:5D:20:35:6E:44:D8:FE:D1:EA:15:0D:0E

```
Dodatkowo w ``jenkins.sh``
```bash
#jenkins_options="$jenkins_options --httpPort=-1 --httpsPort=8443 --httpsCertificate=$jh/ssh/cert.pem --httpsPrivateKey=$jh/ssh/key.pem"
jenkins_options="$jenkins_options --httpPort=-1 --httpsPort=8443 --httpsKeyStore=$jh/ssh/jenkins.keystore --httpsKeyStorePassword=12345678"
```
Firewall
```bash
## disabled
#
# systemctl status firewalld
# systemctl stop firewalld

## or open port
# firewall-cmd --get-active-zones
# firewall-cmd --permanent --zone=public --add-port=8443/tcp
# systemctl restart firewalld
```
### Ćwiczenie 1.1
[Uruchomienie ze skryptu](#uruchomienie-ze-skryptu)

### Ćwiczenie 1.2*
[Uruchomienie ze skryptu po https](#uruchomienie-https) 

W każdym przypadku powinniśmy otrzymać stronę startową
![Start](img/start_1.png)
Hasło ze wskazanego pliku wklejamy w pole tekstowe
```bash
$ cat /opt/tools/jenkins/secrets/initialAdminPassword
```
Setup wizard
![Setup wizard](img/setup_wiz.png)

Jeżeli zamkniemy powyższe okno 
![Setup wizard finish](img/setup_wiz_end.png)

Ważne!
* Pominięto utworzenie konta administratora. Aby się zalogować, użyj loginu 'admin' i hasła użytego podczas konfigurowania Jenkinsa.
* Pominięto konfiguracje bazowego adresu URL Jenkinsa. Aby go skonfigurować, przejdź do strony ``Zarządzaj Jenkinsem``.

Instalujemy sugerowane wtyczki
![Initial plugins](img/initial_plugins.png)

Admin page
![Admin page](img/admin_page.png)
```bash
Login: admin
Hasło: 12345678
Pełna nazwa: Administrator
Adres email: admin@acme.com
```
![Url Wizard](img/url_wiz.png)
![Finish setup](img/finish_setup.png)

## 2: Katalog domowy
### Instalacja via dnf
```bash
JENKINS_HOME=/var/lib/jenkins
logfile=/var/log/jenkins/jenkins.log
war=/usr/lib/jenkins/jenkins.war
```
### Instalacja via jar
```bash
JENKINS_HOME=/home/jenkins/.jenkins
```
Struktura
```bash
├── config.xml              (jenkins root configuration)
├── *.xml                   (other site-wide configuration files)
├── jenkins.sh              (start stop script)
├── jenkins.war             (jenkins war :))
├── log                     (task log directory)
├── logs                    (logs)
├── nodes                   (nodes configuration)
├── plugins                 (stores plugins)
├── secrets                 (secretes needed when migrating credentials to other servers)
├── ssh                     (ssl configuration)
├── updates                 (updates config)
├── userContent             (files in this directory will be served under your http://server/userContent/)
├── users                   (users configuration)
│   ├── admin_4702638789067880202
│   └── users.xml
├── war                     (unpacked jenkins.war)
├── workflow-libs           (shared library)
├── jobs                    (jobs configuration and builds)
│   ├── Job A
│   │   ├── builds
│   │   │   ├── 1
│   │   │   │   ├── build.xml
│   │   │   │   ├── changelog.xml
│   │   │   │   └── log
│   │   │   ├── 2
│   │   │   │   ├── build.xml
│   │   │   │   ├── changelog.xml
│   │   │   │   └── log
│   │   │   ├── legacyIds
│   │   │   └── permalinks
│   │   ├── config.xml
│   │   └── nextBuildNumber
│   └── restCounter
│       ├── builds
│       │   ├── 1
│       │   │   ├── build.xml
│       │   │   └── log
│       │   ├── 2
│       │   │   ├── build.xml
│       │   │   ├── changelog.xml
│       │   │   ├── log
│       │   │   └── pl.klimas7$restCounter -> ../../modules/pl.klimas7$restCounter/builds/2
│       │   ├── 3
│       │   │   ├── build.xml
│       │   │   ├── changelog.xml
│       │   │   ├── log
│       │   │   └── pl.klimas7$restCounter -> ../../modules/pl.klimas7$restCounter/builds/3
│       │   ├── legacyIds
│       │   └── permalinks
│       ├── config.xml
│       ├── modules
│       │   └── pl.klimas7$restCounter
│       │       ├── builds
│       │       │   ├── 2
│       │       │   │   ├── archive
│       │       │   │   │   └── pl.klimas7
│       │       │   │   │       └── restCounter
│       │       │   │   │           └── 0.0.1-SNAPSHOT
│       │       │   │   │               ├── restCounter-0.0.1-SNAPSHOT.jar
│       │       │   │   │               └── restCounter-0.0.1-SNAPSHOT.pom
│       │       │   │   ├── build.xml
│       │       │   │   ├── junitResult.xml
│       │       │   │   └── log
│       │       │   ├── 3
│       │       │   │   ├── archive
│       │       │   │   │   └── pl.klimas7
│       │       │   │   │       └── restCounter
│       │       │   │   │           └── 0.0.1-SNAPSHOT
│       │       │   │   │               ├── restCounter-0.0.1-SNAPSHOT.jar
│       │       │   │   │               └── restCounter-0.0.1-SNAPSHOT.pom
│       │       │   │   ├── build.xml
│       │       │   │   ├── junitResult.xml
│       │       │   │   └── log
│       │       │   ├── legacyIds
│       │       │   └── permalinks
│       │       ├── config.xml
│       │       └── nextBuildNumber
│       └── nextBuildNumber
└── workspace               (working directory for the version control system)
    ├── Job A
    │   └── test_job_a.txt
    └── restCounter
        ├── pom.xml
        ├── README.md
        ├── restCounter.sh
        ├── src
        └── target
```
### 2.1 Ćwiczenie: Zmiana liczby egzekutorów
```bash
$ cd /opt/tools/jenkins/
$ vim config.xml
```
```xml
<?xml version='1.1' encoding='UTF-8'?>
<hudson>
  <disabledAdministrativeMonitors/>
  <version>2.235.5</version>
  <installStateName>RUNNING</installStateName>
  <numExecutors>4</numExecutors>                <!-- z 2 na 4 --> 
  <mode>NORMAL</mode>
  <useSecurity>true</useSecurity>
  <!-- ... -->
</hudson>
```
``Jenkins -> Zarządzaj Jenkinsem -> Odczytaj ponownie konfigurację z dysku``
![Reload configuration](img/reload_configuration.png)

vim: 
 * ``insert`` or ``i`` switch to insert mode
 * ``esc`` switch to command mode
 * ``:wq`` write and quit
 
### 2.2 Ćwiczenie: Odzyskanie dostępu
```bash
$ cd /opt/tools/jenkins/
$ ./jenkins.sh stop
$ vim config.xml
```
```xml
<hudson>
  <disabledAdministrativeMonitors/>
  <version>2.235.5</version>
  <installStateName>RUNNING</installStateName>
  <numExecutors>4</numExecutors>
  <mode>NORMAL</mode>
  <useSecurity>false</useSecurity>              <!-- z true na false -->
  <authorizationStrategy class="hudson.security.FullControlOnceLoggedInAuthorizationStrategy">
    <denyAnonymousReadAccess>true</denyAnonymousReadAccess>
  </authorizationStrategy>
  <!-- ... -->
</hubson>
```
```bash
$ ./jenkins.sh start
```
``Jenkins -> Zarządzaj Jenkinsem -> Konfiguruj ustawienia bezpieczeństwa``
![Konfiguruj ustawienia bezpieczeństwa](img/security_1.png)

``Jenkins -> Użytkownicy -> admin -> Konfiguracja``

![admin -> Konfiguracja](img/security_2.png)

### 2.3: Ćwiczenie* UserContent
``Jenkins -> Nowy Projekt -> Ogólny projekt (nazwa UserContent) -> OK``
![User Content Job](img/user_content_1.png)

``Budowanie -> Dodaj krok budowania -> Uruchom powłokę``
![User Content Job Configuration](img/user_content_2.png)

``echo "Test" > ../../userContent/${BUILD_TAG}.txt``

Wynik [http://192.168.0.178:8080/userContent/](http://192.168.0.178:8080/userContent/)
![User Content Job Output](img/user_content_3.png)

Udostępnianie 'linków'
```bash
$ cd /opt/tools/jenkins/
$ ln -s /opt/tools/maven userContent/maven
```
![User Content Job link](img/user_content_4.png)

[System Properties](https://www.jenkins.io/doc/book/managing/system-properties/)
```bash
$ ./jenkins.sh stop
$ vim jenkins.sh
```
```bash
    java_options="-Dhudson.model.DirectoryBrowserSupport.allowSymlinkEscape=true"
    java -Dcom.sun.akuma.Daemon=daemonized -Djava.awt.headless=true -DJENKINS_HOME=$jh $java_options -jar $jh/jenkins.war $jenkins_options &
```
```bash
$ ./jenkins.sh start
```

![User Content Job link 2](img/user_content_5.png)

## 3: Aktualizacja i instalacja wtyczek
Aktualizacja Jenkinsa dostępna ze strony głównej
![Update Jenkins](img/update_1.png)

lub ``Jenkins -> Zarządzaj Jenkinsem``
![Update Jenkins 2](img/update_2.png)
![Update Jenkins 3](img/update_3.png)

Powrót do poprzedniej wersji ``Jenkins -> Zarządzaj Jenkinsem``
![Downgrade Jenkins](img/update_4.png)

Aktualizacja wtyczek ``Menedżer wtyczek`` ``Jenkins -> Zarządzaj Jenkinsem -> Zarządzaj wtyczkami``
![Update plugins](img/update_plugins_1.png)
![Update plugins](img/update_plugins_3.png)
![Update plugins](img/update_plugins_2.png)

Instalacja wtyczek spoza repozytorium
``Jenkins -> Zarządzaj Jenkinsem -> Zarządzaj wtyczkami`` ``Menedżer wtyczek -> Zaawansowane``
![Install plugin](img/update_plugins_4.png)

### Ćwiczenie 3.1: Aktualizacja
Zainstaluj aktualizacje Jenkinsa, wtyczek oraz dwie wtyczki spoza repozytorium
```
logger-plugin.hpi
old-data-plugin.hpi
``` 
## 4: Status Information
### 4.1: Ćwiczenie
Tworzymy 4 projekty (joby)
``Jenkins -> Nowy Projekt -> Ogólny projekt (JobShedule[1..4])``  
Opcje
* Wykonuj zadania współbieżnie, jeśli zajdzie potrzeba
* Buduj cyklicznie ``* * * * *`` (co minute)
* ``Budowanie -> Uruchom powłoke``
```bash
random=$(( ( RANDOM % 70 )  + 1 ))
echo "Job sleep $random"
sleep $random
```

Kolejne 3 można stworzyć używając funkcji ``Kopiuj z``
``Jenkins -> Nowy Projekt -> Kopiuj z``
![Copy Job 1](img/copy_1.png)
![Copy Job 2](img/copy_2.png)
![Copy Job 3](img/copy_3.png)

### 4.2: Informacje o systemie
Dostępne informacje:
* jvm properties
* system properties
* plugin version
* Memory Usage (new!)
* Thread dump

### 4.3: Informacje o Jenkinsie
Dostępne informacje:
* Zewnętrzne biblioteki oraz ich licencje
* Statyczne zasoby
* Wtyczki i ich licencje

### 4.4: Statystyki obciążenia
### 4.5: Dziennik systemowy
Źródła wtyczki [logger-plugin](https://github.com/klimas7/logger-plugin)
#### 4.5.1: Ćwiczenie
Tworzymy projekt ogólny ``Logger`` w którym użyjemy kroku budowania ``Logger example``  
``Jenkins -> Nowy Projekt -> Ogólny projekt (Logger)``  
``Budowanie -> Logger example``  
![Logger 1](img/logger_1.png)  
Zapisz, Uruchom  
Sprawdzamy co otrzymaliśmy w logach  
``Jenkins -> Zarządzaj Jenkinsem -> Dziennik systemwy -> Wszystkie zdarzenia Jenkinsa``  
![Logger 2](img/logger_2.png)  
```
lis 13, 2020 6:24:18 PM INFO io.jenkins.plugins.LoggerBuilder printLog
Log: INFO code: 800
lis 13, 2020 6:24:18 PM SEVERE io.jenkins.plugins.LoggerBuilder printLog
Log: SEVERE code: 1000
lis 13, 2020 6:24:18 PM WARNING io.jenkins.plugins.LoggerBuilder printLog
Log: WARNING code: 900
```
Dodanie dedykowanego loggera
``Jenkins -> Zarządzaj Jenkinsem -> Dziennik systemwy -> Dodaj nowy rejestrator logów``  
Nazwa: ``Logger``  
![Logger 3](img/logger_3.png)  
Loggers: ``Logger: io.jenkins.plugins`` ``Log level: ALL``  
![Logger 4](img/logger_4.png)   
Save, Uruchom ponownie projekt ``Logger`` w nowo dodanym logerze  
```
lis 13, 2020 6:42:06 PM ALL io.jenkins.plugins.LoggerBuilder
Log: ALL code: -2147483648
lis 13, 2020 6:42:06 PM CONFIG io.jenkins.plugins.LoggerBuilder
Log: CONFIG code: 700
lis 13, 2020 6:42:06 PM FINE io.jenkins.plugins.LoggerBuilder
Log: FINE code: 500
lis 13, 2020 6:42:06 PM FINER io.jenkins.plugins.LoggerBuilder
Log: FINER code: 400
lis 13, 2020 6:42:06 PM FINEST io.jenkins.plugins.LoggerBuilder
Log: FINEST code: 300
lis 13, 2020 6:42:06 PM INFO io.jenkins.plugins.LoggerBuilder printLog
Log: INFO code: 800
lis 13, 2020 6:42:06 PM SEVERE io.jenkins.plugins.LoggerBuilder printLog
Log: SEVERE code: 1000
lis 13, 2020 6:42:06 PM WARNING io.jenkins.plugins.LoggerBuilder printLog
Log: WARNING code: 900
```

## 5: Troubleshooting
```Jenkins -> Zarządzaj Jenkinsem -> Troubleshooting -> Zarządzanie starymi danymi```  
Mechanizm zabezpieczający Jenkinsa przed zmianami w konfiguracji np. wtyczek. Administrator powinien świadomie przeglądnąć zmiany i ewentualnie podjąć odpowiednie działania.
* wyciszyć powiadomienie.
* przywrócić poprzednią wersję wtyczki (jenkinsa).  

  
Przykład zmian w pluginie: 
Źródła wtyczki [OldDataPlugin](https://github.com/klimas7/OldDataPlugin/commits/master)  
Tworzymy projekt ogólny ``OldData`` w którym użyjemy kroku budowania ``Old Data``  
``Jenkins -> Nowy Projekt -> Ogólny projekt (OldData)``  
``Budowanie -> Old Data`` ``First, Second `` mogą być dowolne  
![Old Data 1](img/oldData_1.png)  
Save, Uruchom  
```
Uruchomiono przez użytkownika Administrator
Running as SYSTEM
Building in workspace /opt/tools/jenkins/workspace/OldData
First: One Second: Two
Finished: SUCCESS
```
Instalujemy kolejną wersję wtyczki oldData ``old-data-plugin_v2.hpi`` [Materiały](#do-pobrania)  
``Jenkins -> Zarządzaj Jenkinsem -> Zarządzaj wtyczkami -> Zawansowane -> Prześlij wtyczkę (old-data-plugin_v2.hpi)``  
![Old Data 2](img/oldData_2.png)  
Restart.  
![Old Data 3](img/oldData_3.png)  
![Old Data 4](img/oldData_4.png)  
### 5.1: Ćwiczenie Wykonać powyższy przykład.
## 6: Skonfiguruj system
Miejsce w Jenkinsie gdzie znajdziemy globalne ustawienia samego Jenkinsa oraz wtyczek, zmienne środowiskowe ...  
``Jenkins -> Zarządzaj Jenkinsem -> Skonfiguruj system``
* Globalne ustawienia Maven
* Konfiguracja węzła głównego (liczba wykonawców, etykiety, plan wykorzystania)
* Okres ponowienia projektu (Quiet period)
* Liczba powtórzeń przy próbie z systemu kontroli wersji (SCM checkout retry count)
* Jenkins Location (jenkins URL, System Admin e-mail addres)
* Serve resource files from another domain - wskazujemy adres zasobów z które Jenkins traktuje jako zaufane
* Globalne zmienne (Global properties)
    * Lokalizacja narzędzi, duplikat ``Jenkins -> Zarządzaj Jenkinsem -> Globalne narzędzia do konfiguracji``
    * Zmienne środowiskowe, możemy zdefiniować pary klucz-wartość dostępne w każdym projekcie
* Pipeline Speed/Durability Settings [Scaling Pipelines](https://www.jenkins.io/doc/book/pipeline/scaling-pipeline/)
    * None: use pipeline default (MAX_SURVIVABILITY)
    * Performance-optimized: much faster (requires clean shutdown to save running pipelines)
    * Less durability, a bit faster (specialty use only)
    * Maximum durability but slowest (previously the only option)
* Usage Statistics
* Timestamper
* Global Build Discarders (news) 
    * Specific Build Discarder
* Global Pipeline Libraries [Shared Library](#shared-library)
* Shell
* E-mail Notification

### 6.1: Ćwiczenie, Jenkins Location
Zdefiniować System Admin e-mail addres ``jenkins.klimas7@gmail.com``
![Admin Email](img/global_3.png)  
### 6.2: Ćwiczenie, Global properties
Dodać kilka zmiennych środowiskowych
```
STAGE_1:false
TEST_BRANCH:master
TEST_SCRIPT:Test_script
```
![Properties](img/global_4.png)  
### 6.3: Ćwiczenie, Global Build Discarders
Ustawić globalny log Rotation ``Maksymalna ilość zadań do przechowania: 5``
![Properties](img/global_5.png)  
### 6.4: Ćwiczenie, E-mail Notification
Powiadomienia e-mail z wykorzystaniem konta google
```
SMTP server:                smtp.gmail.com
Use SMTP Authentication:    true
User Name:                  jenkins.klimas7@gmail.com
Password:                   <?>
Use SSL:                    true
Use TLS:                    true
SMTP Port:                  465
```
![e-mail](img/global_6.png)  
Konto Google  
![Google Account](img/global_7.png)  
## 7: Zarządzanie węzłami (nodes)
Dobre praktyki:
* Węzeł będący masterem powinien myć jak najmniej obciążony
* Liczba wykonawców (executors) powinna być dostosowana do zasobów danego węzła

``Jenkins -> Zarządzaj Jenkinsem -> Zarządzaj węzłami``
![Node 1](img/node_1.png)  
Dodając nowy węzeł mamy możliwość dodania kolejnego lub utworzenie kopii już istniejącego.
![Node 2](img/node_2.png)  
Plan wykorzystania:
* Wykorzystuj ten węzeł tak bardzo, jak to tylko możliwe
* Uruchamiaj te projekty, które mają etykietę pasującą do tego węzła

Metoda uruchomienia:
* Launch agent by connecting it to the master (JNLP)
* Launch agents via SSH
* Launch agent via execution of command on the master

Availability:
* Keep this agent online as much as possible
* Bring this agent online according to a schedule
* Bring this agent online when in demand, and take offline when idle

### 7.1 Uruchomienie via JNLP
``JNLP`` [Java Network Launch Protocol](https://docs.oracle.com/javase/tutorial/deployment/deploymentInDepth/jnlp.html)  
W pierwszej kolejności należy w ustawieniach bezpieczeństwa odblokować port dla agentów  
``Jenkins -> Zarządzaj Jenkinsem -> Konfiguruj ustawienia bezpieczeństwa -> Agents``  
``TCP port for inbound agents -> Fixed: 8082``  
![Node 7](img/node_7.png)  
Dodatkowo port należy odblokować w zaporze sieciowej
```bash
firewall-cmd --permanent --zone=public --add-port=8082/tcp
systemctl restart firewalld
``` 
![Node 8](img/node_8.png)  
``Jenkins -> Węzły -> Linux_2``  
![Node 9](img/node_9.png)  
```bash
$ java -jar agent.jar -jnlpUrl http://192.168.0.178:8080/computer/Linux_2/slave-agent.jnlp -secret f9b49c94b7e9cae76ffb0b63be0f34a9e7ac52c14aec447a2d27a90ced8180d3 -workDir "/tmp/linux_2"
lis 15, 2020 11:52:30 PM org.jenkinsci.remoting.engine.WorkDirManager initializeWorkDir
INFO: Using /tmp/linux_2/remoting as a remoting work directory
lis 15, 2020 11:52:30 PM org.jenkinsci.remoting.engine.WorkDirManager setupLogging
INFO: Both error and output logs will be printed to /tmp/linux_2/remoting
lis 15, 2020 11:52:30 PM hudson.remoting.jnlp.Main createEngine
INFO: Setting up agent: Linux_2
lis 15, 2020 11:52:30 PM hudson.remoting.jnlp.Main$CuiListener <init>
INFO: Jenkins agent is running in headless mode.
lis 15, 2020 11:52:30 PM hudson.remoting.Engine startEngine
INFO: Using Remoting version: 4.5
lis 15, 2020 11:52:30 PM org.jenkinsci.remoting.engine.WorkDirManager initializeWorkDir
INFO: Using /tmp/linux_2/remoting as a remoting work directory
lis 15, 2020 11:52:30 PM hudson.remoting.jnlp.Main$CuiListener status
INFO: Locating server among [http://192.168.0.178:8080/]
lis 15, 2020 11:52:30 PM org.jenkinsci.remoting.engine.JnlpAgentEndpointResolver resolve
INFO: Remoting server accepts the following protocols: [JNLP4-connect, Ping]
lis 15, 2020 11:52:30 PM hudson.remoting.jnlp.Main$CuiListener status
INFO: Agent discovery successful
  Agent address: 192.168.0.178
  Agent port:    8082
  Identity:      c9:b8:2c:81:18:d8:6a:ef:19:e8:d8:91:84:7a:ba:64
lis 15, 2020 11:52:30 PM hudson.remoting.jnlp.Main$CuiListener status
INFO: Handshaking
lis 15, 2020 11:52:30 PM hudson.remoting.jnlp.Main$CuiListener status
INFO: Connecting to 192.168.0.178:8082
lis 15, 2020 11:52:30 PM hudson.remoting.jnlp.Main$CuiListener status
INFO: Trying protocol: JNLP4-connect
lis 15, 2020 11:52:30 PM hudson.remoting.jnlp.Main$CuiListener status
INFO: Remote identity confirmed: c9:b8:2c:81:18:d8:6a:ef:19:e8:d8:91:84:7a:ba:64
lis 15, 2020 11:52:31 PM hudson.remoting.jnlp.Main$CuiListener status
INFO: Connected
```

![Node 10](img/node_10.png)

Odnośniki: [java11-preview-availability](https://jenkins.io/blog/2018/12/14/java11-preview-availability/), 
[JENKINS-52282](https://issues.jenkins-ci.org/browse/JENKINS-52282), 
[Jenkins PR](https://github.com/jenkinsci/jenkins/pull/3766)
### 7.3 Node Monitoring
![Node 6](img/node_6.png)
### 7.4 Uruchomienie via SSH, Ćwiczenie
Utworzyć 2 dodatkowe węzły na naszej wirtualnej maszynie przy wykorzystaniu ssh
* **Linux_1**; etykiety: linux big_ram; katalog: /work/node1
* **Windows**, etykiety: windows; katalog: /work/node2

```bash
#Tworzymy katalogi dla naszych węzłów
$ mkdir -p /work/node{1,2}
```
Tworzymy pierwszy węzeł  
![Node 3](img/node_3.png)  
Tworzymy drugi jako kopię pierwszego  
![Node 4](img/node_4.png)  
Z odpowiednimi modyfikacjami  
![Node 5](img/node_5.png)
## 8: Globalne narzędzia do konfiguracji
### 8.1: Managed files
``Managed files`` to miejsce, w którym możemy definiować pliki konfiguracyjne dostępne dla wszystkich węzłów  i projektów  
![Global 2](img/global_2.png)  
![Global 1](img/global_1.png)

### 8.2: Globalne narzędzia do konfiguracji
Jenkins pozwala zdefiniować narzędzia wykorzystywane w projektach, takie jak maven, java, docker.  
``Jenkins -> Zarządzaj Jenkinsem -> Globalne narzędzia do konfiguracji``   
#### Maven Configuration
#### JDK
```
Nazwa       jdk8
JAVA_HOME   /opt/java/jdk8

Nazwa       jdk12
JAVA_HOME   /opt/java/jdk12
```
#### Maven  
```
Name        mvn
MAVEN_HOME  /opt/tools/maven
```
#### Docker  
```
Name                docker
Installation root   /usr/bin
```
### 8.2: Globalne narzędzia do konfiguracji dla węzłów
![Global 3](img/node_11.png)
### 8.3: Ćwiczenie
Zdefiniować jdk, maven oraz docker zgodnie z powyższym opisem

## 9: Konfiguruj ustawienia bezpieczeństwa
``Jenkins -> Zarządzaj Jenkinsem -> (Security) -> Konfiguruj ustawienia bezpieczeństwa``
### 9.1 Authentication
* Własna baza danych Jenkinsa
* LDAP

### 9.2 Authorization
* Każdy użytkownik może wszystko
* Logged-in users can do anything
* Matrix-based security
* Project-based Matrix Authorization Strategy

### 9.3 Agents
Definicja portu, z którego będą korzystać agenci do komunikacji z Jenkinsem  
![Agents port](img/security_3.png)  
[Uruchomienie via JNLP](#71-uruchomienie-via-jnlp)
### 9.4 SSH Server
Definicja portu dla serwera ssh wbudowanego w Jenkinsa wykorzystywany do Jenkins CLI  
![SSH port](img/security_4.png)  
[SSH](#111-ssh)

### 9.5 Ćwiczenie 1
Autentykacja za pomocą LDAP (Lightweight Directory Access Protocol). [Nasz LDAP UI](http://ovh.klimas7.pl/ldap/)
```
Server:                         ovh.klimas7.pl
root DN:                        dc=acme,dc=com
User search filter:             uid={0}
Group membership:               Search for LDAP groups containing user
Manager DN:                     cn=admin,dc=acme,dc=com
Manager Password:               <?>
Display Name LDAP attribute:    displayname
Email Address LDAP attribute:   mail  
```
![LDAP Configuration](img/ldap_1.png)  
![LDAP Configuration 2](img/ldap_2.png)  

LDAP Hints! 
* użytkownicy: jadmin, bklimas, jwajda, jzmarz, pkocot, rpaliga, mrawski, gwawryk, amarchut, pzadrozny, akalynovska, asemenkov, mkajdanska, mchernetskyi, upietrusa
* każdy ma hasło ``12345678``
* grupy: admin, dev, git, qa
* jadmin (Jenkins Administrator) należy tylko do grupy admin
* bklimas (Boguslaw Klimas) nie należy do grupy admin
* Pozostali użytkownicy należą do wszystkich grup  

Test: Test LDAP settings  
![LDAP Test](img/ldap_3.png)
![LDAP Test](img/ldap_4.png)
### 9.6 Ćwiczenie 2
Zalogowany użytkownik może wszystko, ananimowy użytkownik ma mieć możliwość odczytu  
``Authorization -> Logged-in users can do anything -> Allow anonymous read access``  
![Authorization 1](img/security_5.png)

### 9.7 Ćwiczenie 3
Przykład z ćwiczenia 2 zrealizować za pomocą ``Matrix-based security``  
![Matrix configuration](img/matrix_1.png)
### 9.8 Ćwiczenie 4
Hint!
* Uprawnienia są sumą uprawnień danego użytkownika i grup, do których należy  

Ćwiczenie:
* użytkownik bklimas powinien mieć dostęp tylko do projektów (uruchomienie i podgląd)
* użytkownik jadmin powinien mieć uprawnienia administratora
* wasz użytkownik (np. jzmarz) powinien mieć uprawnienia administratora 
* Anonimowy użytkownik nie powinien mieć dostępu
* Inny zalogowany użytkownik powinien mieć tylko odczyt

![Matrix configuration](img/matrix_2.png)

### 9.9 Ćwiczenie 5
Wykujemy ćwiczenie 4 w kontekście ``Project-based Matrix Authorization Strategy``  
![Matrix configuration 2](img/matrix_3.png)  
Dodajemy nowy projekty (nie musi robić nic)  
``Jenkins -> Nowy Projekt -> Ogólny projekt (Matrix_1)``  
Przy aktywowanym ``Project-based Matrix Authorization Strategy`` w każdym nowym projekcie mamy dostępną opcję ``Enable project-based security``
gdzie możemy określić konkretne uprawnienia w donośnie do konkretnego projektu  

Hint!
* Mamy możliwość określenia strategi dziedziczenia uprawnień ``Inheritance Strategy``

Dla projektu ``matrix_1`` zdefiniować następujące zasady bezpieczeństwa
* Anonimowy użytkownik powinien mieć odczyt
* Inny zalogowany użytkownik powinien mieć możliwość odczyt, jak i uruchomienia
* użytkownik bklimas powinien mieć pełen dostęp do tego projektu

![Project Matrix configuration](img/matrix_4.png) 

## 10: Konsola skryptów
Kolejnym z przydatnych narzędzi dostępnych w Jenkinsie jest konsola skryptów.  
``Jenkins -> Zarządzaj Jenkinsem -> (Tools and Actions) -> Konsola skryptów``
![Groovy 1](img/groovy_1.png)  

```groovy
// Wyświetlenie dostępnych wtyczek 
println(Jenkins.instance.pluginManager.plugins)
```
```groovy
// Pobranie treści wybranej strony
println 'http://www.google.com'.toURL().text
```
[Jenkins javadoc](https://javadoc.jenkins.io/)
```groovy
// Wypisanie wszystkich zmiennych globalnych na masterze i agentach
import jenkins.*
import jenkins.model.*
import hudson.*
import hudson.model.*

jenkins = Jenkins.getInstance()
nodeProperties = jenkins.getGlobalNodeProperties()
props = nodeProperties.getAll(hudson.slaves.EnvironmentVariablesNodeProperty.class)

for (prop in props) {
    prop.getEnvVars().each{ println "${it}"; }
}

//Agents

slaves = Jenkins.getInstance().slaves
for (slave in slaves) {
    props = slave.nodeProperties.getAll(hudson.slaves.EnvironmentVariablesNodeProperty.class)
    println slave.name
    for (prop in props) {
        prop.getEnvVars().each{ println "${it}"; }
    }
}


println "OK";
```
```groovy
//Wypisanie tych projektów które nie mają ustawionego logRotator
jenkins = Jenkins.getInstance()
def jobs = jenkins.getItems(hudson.model.FreeStyleProject.class) //hudson.maven.MavenModuleSet.class

jobs.findAll{ !it.logRotator}.each {
    println it.name;
}

return "OK"
```
```groovy
//Dodanie zmiennych globalnych
import jenkins.*
import jenkins.model.*
import hudson.*
import hudson.model.*

def addVariable(String key, String value, Map envVars){
    String oldValue = envVars.get(key);
    if (oldValue != null) {
        println "Global variable exists: " + key + " -> " + oldValue + " Update this!";
    }
    envVars.put(key, value)
    println "Add/Update global variable: " + key + " -> " + value;
}

jenkins = Jenkins.getInstance()
nodeProperties = jenkins.getGlobalNodeProperties()
props = nodeProperties.getAll(hudson.slaves.EnvironmentVariablesNodeProperty.class)


if ( props.size() != 1 ) {
    println("error: unexpected number of environment variable containers: " + props.size() + " expected: 1")
} else {
    envVars = props.get(0).getEnvVars();

    addVariable("TEST_SCRIPT", "Test_script", envVars)

    jenkins.save();
}


println "OK";
```
```groovy
//Ustawienie logRotator w nie mają logRotator
import hudson.tasks.*

jenkins = Jenkins.getInstance()
def jobs = jenkins.getItems(hudson.model.FreeStyleProject.class) //hudson.maven.MavenModuleSet.class


jobs.findAll{ !it.buildDiscarder}.each {
    println it.name;
    println it.setBuildDiscarder(new LogRotator(-1, 20, -1, -1) )
    it.save()
}

return "OK"
```
### 10.1: Ćwiczenie, wypróbować powyższe przykłady
## 11: CLI
``CLI`` Command Line Interface. 

Dostęp do Jenkinsa z linii komend można zrealizować na 2 sposoby:
* ssh
* Klient dostarczony w postaci pliku [jenkins-cli.jar](http://192.168.0.178:8080/jnlpJars/jenkins-cli.jar)  

### 11.1: ssh
W pierwszej kolejności należy odblokować serwer ssh wbudowany w Jenkinsa (np. na porcie 8081).  
``Jenkins -> Zarządzaj Jenkinsem -> (Security) -> Konfiguruj ustawienia bezpieczeństwa -> SSH Server``  
![SSH Server](img/cli_ssh_1.png)  
Wybrany port należy odblokować w firewallu.  
```bash
# firewall-cmd --permanent --zone=public --add-port=8081/tcp
# systemctl restart firewalld
```
Na naszym lokalnym komputerze możemy wykonać
```bash
$ ssh -l admin -p 8081 192.168.0.178 help
## Jendak w wyniku najprawdopodobniej otrzymamy
admin@192.168.0.178: Permission denied (publickey).
```
Nasz klucz publiczny należy dodać do listy kluczy wybranego użytkownika. W naszym przypadku może to być admin.
```bash
#Geracja kluczy rsa jeżeli wcześniej nie mieliśmy
$ ssh-keygen
$ ll ~/.ssh/
razem 12
-rw-------. 1 jenkins jenkins 1843 11-15 10:08 id_rsa
-rw-r--r--. 1 jenkins jenkins  411 11-15 10:08 id_rsa.pub
-rw-r--r--. 1 jenkins jenkins  571 11-15 09:55 known_hosts

$ cat ~/.ssh/id_rsa.pub
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCzsDiyJ+4WZAwaYDVz43Zrm6RCxPTzFWXnUfuBdAx6BmM98gxnveU0k+AbiiF739ZTDKxmWHyBmgGKVMzrSYoldKAPvTii4X/FtQfdsUrvl3gL9E+UM2MJ3k+yaYS88RmfDH7TTYBAwvFYqP3+F7F9tX+Te2Purf/ZwU+r5ekPMP4gtkO9Pi1XtzdOAW2vDHrXm2QJqOQPa8Ppx6SalrLOnlCjo5RtpEIBhjTN3WkwhRYHxDZedTZE0YFyn8fNna4UlZiEhPaLRu6utykDTyfOOhFiONYj9naNzv0/wIAYgYAFreD5CCNZEVMKIYwuKlS9Tb0gyzpDQYBjNGAvks2v jenkins@localhost.localdomain
```
``Jenkins -> Użytkownicy -> admin -> Konfiguracja -> SSH Public Keys``  
![SSH Public Keys](img/cli_ssh_2.png)  
Hint: Możemy dodać dowolną ilość kluczy  
```bash
$ ssh -l admin -p 8081 192.168.0.178 help
  add-job-to-view
    Adds jobs to view.
  build
    Builds a job, and optionally waits until its completion.
```
### 11.2: jenkins-cli.jar
Pobieramy ``jenkins-cli.jar`` ze strony naszego Jenkinsa  
``Jenkins -> Zarządzaj Jenkinsem -> (Tools and Actions) -> Wiersz poleceń Jenkinsa``
```bash
$ java -jar jenkins-cli.jar -s http://192.168.0.178:8080/

ERROR: You must authenticate to access this Jenkins.
Jenkins CLI

$ java -jar jenkins-cli.jar -s http://192.168.0.178:8080/ -auth admin:12345678
  add-job-to-view
    Adds jobs to view.
  build
    Builds a job, and optionally waits until its completion.
```

Jeżeli nie chcemy używać hasła możemy użyć tokena przypisanego do danego użytkownika  
``Jenkins -> Użytkownicy -> admin -> Konfiguracja -> API Token``
![Api token](img/cli_client_jar_1.png)
```bash
$ java -jar jenkins-cli.jar -s http://192.168.0.178:8080/ -auth admin:116f410f45f00c7b533ddc889e978fec37 help
  add-job-to-view
    Adds jobs to view.
  build
    Builds a job, and optionally waits until its completion.
```
```bash
# W tym przypadku musimy mieć zarejestrowany klucz publiczny 
$ java -jar jenkins-cli.jar -s http://192.168.0.178:8080/ -ssh -user admin
lis 15, 2020 6:41:35 PM io.jenkins.cli.shaded.org.apache.sshd.common.util.security.AbstractSecurityProviderRegistrar getOrCreateProvider
INFO: getOrCreateProvider(EdDSA) created instance of io.jenkins.cli.shaded.net.i2p.crypto.eddsa.EdDSASecurityProvider
  add-job-to-view
    Adds jobs to view.
  build
    Builds a job, and optionally waits until its completion.
```
```
$ java -jar jenkins-cli.jar -s http://192.168.0.178:8080/ -ssh -user admin list-jobs
$ java -jar jenkins-cli.jar -s http://192.168.0.178:8080/ -ssh -user admin get-job 'Job A'
```
tworzymy nowy job ``CLI_Invoke`` na podstawie pustego szablonu (tworzymy plik template_job.xml) 
```xml
<?xml version='1.1' encoding='UTF-8'?>
<!-- template_job.xml -->
<project>
  <description></description>
  <keepDependencies>false</keepDependencies>
  <properties>
    <hudson.plugins.jira.JiraProjectProperty plugin="jira@3.1.3"/>
  </properties>
  <scm class="hudson.scm.NullSCM"/>
  <canRoam>true</canRoam>
  <disabled>false</disabled>
  <blockBuildWhenDownstreamBuilding>false</blockBuildWhenDownstreamBuilding>
  <blockBuildWhenUpstreamBuilding>false</blockBuildWhenUpstreamBuilding>
  <triggers/>
  <concurrentBuild>false</concurrentBuild>
  <builders/>
  <publishers/>
  <buildWrappers/>
</project>
```
```bash
$ java -jar jenkins-cli.jar -s http://192.168.0.178:8080/ -auth admin:116f410f45f00c7b533ddc889e978fec37 create-job CLI_Invoke < template_job.xml
$ java -jar jenkins-cli.jar -s http://192.168.0.178:8080/ -auth admin:116f410f45f00c7b533ddc889e978fec37 build CLI_Invoke
$ java -jar jenkins-cli.jar -s http://192.168.0.178:8080/ -auth admin:116f410f45f00c7b533ddc889e978fec37 console CLI_Invoke 1
```
```xml
<?xml version='1.1' encoding='UTF-8'?>
<!-- update_job.xml -->
<project>
  <actions/>
  <description></description>
  <keepDependencies>false</keepDependencies>
  <properties>
    <hudson.plugins.jira.JiraProjectProperty plugin="jira@3.1.3"/>
    <hudson.model.ParametersDefinitionProperty>
      <parameterDefinitions>
        <hudson.model.StringParameterDefinition>
          <name>param</name>
          <description></description>
          <defaultValue>default value</defaultValue>
          <trim>false</trim>
        </hudson.model.StringParameterDefinition>
      </parameterDefinitions>
    </hudson.model.ParametersDefinitionProperty>
  </properties>
  <scm class="hudson.scm.NullSCM"/>
  <canRoam>true</canRoam>
  <disabled>false</disabled>
  <blockBuildWhenDownstreamBuilding>false</blockBuildWhenDownstreamBuilding>
  <blockBuildWhenUpstreamBuilding>false</blockBuildWhenUpstreamBuilding>
  <triggers/>
  <concurrentBuild>false</concurrentBuild>
  <builders>
    <hudson.tasks.Shell>
      <command>echo &quot;${param}&quot;</command>
      <configuredLocalRules/>
    </hudson.tasks.Shell>
  </builders>
  <publishers/>
  <buildWrappers/>
</project>
```
```
$ java -jar jenkins-cli.jar -s http://192.168.0.178:8080/ -auth admin:116f410f45f00c7b533ddc889e978fec37 update-job CLI_Invoke < update_job.xml
$ java -jar jenkins-cli.jar -s http://192.168.0.178:8080/ -auth admin:116f410f45f00c7b533ddc889e978fec37 build CLI_Invoke
$ java -jar jenkins-cli.jar -s http://192.168.0.178:8080/ -auth admin:116f410f45f00c7b533ddc889e978fec37 console CLI_Invoke 2
$ java -jar jenkins-cli.jar -s http://192.168.0.178:8080/ -auth admin:116f410f45f00c7b533ddc889e978fec37 build CLI_Invoke -p param='111 222'
$ java -jar jenkins-cli.jar -s http://192.168.0.178:8080/ -auth admin:116f410f45f00c7b533ddc889e978fec37 console CLI_Invoke 3
```
### 11.3: curl
Dodatkowo cześć rzeczy możemy wykonać wywołując odpowiedni url  
```bash
curl -X POST 'http://admin:116f410f45f00c7b533ddc889e978fec37@192.168.0.178:8080/job/CLI_Invoke/buildWithParameters?param=abc'
```
### 11.4: Ćwiczenie. 
Na podstawie powyższych informacji stworzyć nowy projekt ``CLI_Invoke`` wykonać jego aktualizacje oraz uruchomić z parametrami, jak i bez.

## 12: Rest and xml api
Praktycznie każdą informację, którą mamy prezentowaną w Jenkinsie możemy również zaprezentować w formacie ``json`` lub ``xml``  
Przykłady 
* [Strona główna](http://192.168.0.178:8080/api/json?pretty=true)
* [Projekt](http://192.168.0.178:8080/job/CLI_Invoke/api/json?pretty=true)
* [Build](http://192.168.0.178:8080/job/CLI_Invoke/4/api/json?pretty=true)

[Dokumentacja](https://www.jenkins.io/doc/book/using/remote-access-api/)  
![Api](img/api_1.png)
## 13: Ogólny projekt (Freestyle project)
Najbardziej podstawowy typ projektu dostępny w Jenkinsie. Możemy w nim wykonać cokolwiek.  
Oficjalny opis: _To jest podstawowa funkcja Jenkinsa. Jenkins stworzy projekt łączący dowolny SCM z dowolnym systemem budującym, może to być również wykorzystane do czegoś innego niż budowanie oprogramowania._ 
najtrafniej oddaje istotę projektu.

Instalujemy wtyczki: ``Active Choices, Git Parameter, Conditional BuildStep, Parameterized Trigger``

### 13.1 Istotne opcje
* Enable project-based security, omawiane w punkcie [Project-based Matrix Authorization Strategy](#99-wiczenie-5)
* Porzuć stare zadania, ``Strategi -> Log Rotation -> Maksymalna ilość zadań do przechowania -> 5`` decydujemy, ile wykonań jest przechowywane wstecz.
  Jenkins pozostawi jedno prawidłowe wykonanie, jeżeli istnieje. Należy pamiętać, że wykonania usuwane są dopiero po skończonym wykonaniu projektu.
* This build requires [lockable resources](#138-lockable-resources)
* Throttle builds, określenie jak często dany projekt może być wykonany np. nie częściej niż raz na godzinę [Throttle builds](#139-Throttle-builds)
* To zadanie jest sparametryzowane [Warto zwrócić uwagę](#1310-dodatkowe-parametry)
    * Tekst
    * Wartość logiczna
    * Lista wyboru
    * ...
    * Active Choice*
    * Git parameter*
* Zablokuj zadania, oznacza, że zadanie nie będzie mogło być uruchomione przez użytkownika ani wyzwolone przez zmiany w repozytorium
* Wykonuj zadania współbieżnie, jeśli zajdzie potrzeba
* Restrict where this project can be run, określa etykiety agentów, na których dany projekt może być wykonany
* Cichy okres, możliwość nadpisania ustawień globalnych [Skonfiguruj system](6-skonfiguruj-system) 
* Liczba ponowień, możliwość nadpisania ustawień globalnych [Skonfiguruj system](6-skonfiguruj-system)

### 13.2 Repozytorium kodu
* Git
    * Additional Behaviours, Advanced checkout behaviours, Advanced clone behaviours
    
### 13.3 Wyzwalacze zadania
* Buduj cyklicznie
* Pobierz z repozytorium kodu (Pool SCM)
* Uruchamiaj, gdy inne zadania zostaną zakończone

### 13.4 Budowanie
* Invoke top-level Maven targets
* Uruchom powłokę (list of available environment variables)
* Conditional step

### 13.5 Akcje po zadaniu
* Zachowaj artefakty
* E-mail Notification
* Publish JUnit test result report
* Uruchom inne zadania

### 13.6 Ćwiczenie 1
* Tworzymy dwa ogólne projekty ``Build, Deploy``
* Projekt ``Deploy``
    * powinien przetrzymywać 10 ostatnich wykonań
    * powinien mieć parametr tekstowy o nazwie `info` (domyślnie pusty)
    * jako krok wykonania powinien wypisać wartość parametru `info`, nazwę projektu, numer kompilacji oraz build tag
    * w kolejnym kroku powinien poczekać `10 s`
* Projekt ``Build`` 
    * powinien przetrzymywać 10 ostatnich wykonań
    * powinien zablokować dedykowany sobie zasób 
    * powinna być możliwość uruchomienia projektu współbieżnie 
    * powinien mieć parametr logiczny o nazwie `deploy` (domyślnie `false`)
    * powinien mieć parametr tekstowy o nazwie `info` (domyślnie `deploy information`)
    * powinien być uruchomiony na agencie z etykietą `linux`
    * powinien być uruchomiany cyklicznie co godzinę
    * jako krok wykonania powinien wypisać wartość parametru `deploy`, nazwę projektu, numer wykonania oraz build tag
    * w kolejnym kroku powinien poczekać `10 s`
    * jeżeli zaznaczono ``deploy`` to powinna być wypisana informacja `Deploy will be invoke` oraz wartość parametru info
    * jeżeli zaznaczono ``deploy`` powinien zostać wywołany projekt ``Deploy`` z przekazaniem wszystkich parametrów
    * Należy poczekać na zakończenie projektu `deploy`

* `Deploy`
![Job Deploy 1](img/job_deploy_1.png)   
![Job Deploy 2](img/job_deploy_2.png)   

* `Build`
![Job Build 1](img/job_build_1.png)   
![Job Build 2](img/job_build_2.png)  
![Job Build 3](img/job_build_3.png)  
![Job Build 4](img/job_build_4.png)  
![Job Build 5](img/job_build_5.png)  
![Job Build 6](img/job_build_6.png)  
![Job Build 7](img/job_build_7.png)  

### 13.7 Ćwiczenie 2
* Tworzymy ogólne projekty ``Build_Learn``
* Projekt ``Build_Learn``
    * powinien przetrzymywać 10 ostatnich wykonań 
    * powinna być możliwość wyboru gałęzi, z której będzie kompilowany projekt, nazwa parametru `branch` typ `Branch` wartość domyślna `origin/master`
    * z cichym okresem `60 s`
    * liczba prób pobrania z repozytorium `3`
    * Repozytorium kodu: Git, Repository URL `ssh://git@ovh.klimas7.pl:7999/lab/learn.git` (waga musimy mieć wygenerowany klucz i dodany klucz publiczny do bitbucketa)
    * Branch Specifier odczytywany z parametru `branch`
    * Repository browser: `bitbucketweb` URL `http://ovh.klimas7.pl/bitbucket/projects/LAB/repos/learn`
    * Projekt powinien sprawdzać zmiany w kodzie co 5 minut `*/5 * * * *` i wykonywać kompilację, jeśli zmiany zostały wprowadzone
    * Post-commit hooks powinny być ignorowane
    * Krokiem budowania powinien być `Invoke top-level Maven targets` z wersją mavena `mvn` oraz celami `clean install`
    * Wygenerowany artefakt (Learn.*.jar) powinien być archiwizowany
    * Powinny być zachowywane wyniki testów 
    * Prawidłowy build powinien zostać zachowany i oznaczony jako `RC #1`
    
* ``Build_Learn``
![Job Build Learn 1](img/job_build_learn_1.png)
![Job Build Learn 2](img/job_build_learn_2.png)
![Job Build Learn 3](img/job_build_learn_3.png)
![Job Build Learn 4](img/job_build_learn_4.png)
![Job Build Learn 5](img/job_build_learn_5.png)
![Job Build Learn 6](img/job_build_learn_6.png)

### 13.8 lockable resources*
Definicja ``Jenkins -> Zarządzaj Jenkinsem -> (System Configuration) -> Skonfiguruj system -> Lockable Resources Manager``
```
Resource:
  Name: Test_Resources
  Description: Example Test Resources
  Labels: test_resouce
  Reserved by: 
```
![Lockable Resources 1](img/resource_1.png)  
Monitoring ``Jenkins -> Lockable Resources``  
![Lockable Resources 2](img/resource_2.png)  
Dodajemy konfiguracje w projekcie  
![Lockable Resources 4](img/resource_4.png)  
```
Uruchomiono przez użytkownika Jenkins Administrator
Running as SYSTEM
[lockable-resources] acquired lock on [Test_Resources]
Building on master in workspace /opt/tools/jenkins/workspace/Job_A
```
![Lockable Resources 3](img/resource_3.png)  
Jeżeli zasoby będą zablokowane to przy uruchomieniu projektu otrzymamy następujący komunikat  
![Lockable Resources 5](img/resource_5.png)  
### 13.9 Throttle builds*
Definiujemy w projekcie  
![Throttle 1](img/throttle_1.png)  
Przy próbie wcześniejszego uruchomienia projektu lub jego wyzwolenia otrzymamy
![Throttle 2](img/throttle_2.png)  
### 13.10 Dodatkowe parametry*
#### Active Choices
``To zadanie jest sparametryzowane -> Active Choices Parameter``
```
Name:           param_a
Script:         Groovy Script
Groovy Script:  return ['a','b','c']
Choice Type:    Single Select
```
``To zadanie jest sparametryzowane -> Active Choices Reactive Parameter``
```
Name:           param_b
Script:         Groovy Script
Groovy Script:  def map = ['a': ['a1','a2','a3'],'b': ['b1','b2','b3'],'c': ['c1','c2','c3']]
                return map[param_a]
Choice Type:    Single Select
Referenced parameters:  param_a	
```
![Active 1](img/active_1.png)  
#### Git Parameter
Na podstawie zdefiniowanego repozytorium git wtyczka umożliwia wybranie ``tag, branch, branch lub tag, Revision, Pull Request``
![Git Parameter 1](img/git_parameter_1.png)  
![Git Parameter 2](img/git_parameter_2.png)  
![Git Parameter 3](img/git_parameter_3.png)  
## 14: Maven project
W porównaniu z ogólnym projektem `Maven project` ma odgórnie zdefiniowany główny krok budowania oraz kroki, które można wykonać przed (pre) jako i po (post).
![Maven project 1](img/maven_project_1.png)  

### 14.1 Ćwiczenie
Dla projektu typu maven wykonać [13.7 Ćwiczenie 2](#137-wiczenie-2)

Hint!
* Wyniki testów są dostępne automatycznie 
* W projekcie typu maven mamy dostępne moduły, w których przetrzymywane są artefakty
* Jeżeli projekt się kompiluje, ale w testy wykazują błędy wykonanie oznaczane jest jako niestabilne

## 15: Pipelines

**_Your Job is Your Code_**

Start:
* Local pipeline syntax: http://{jenkins_host}:{jenkins_port}/job/{job_name}/pipeline-syntax/
* Documentation: [https://www.jenkins.io/doc/book/pipeline/](https://www.jenkins.io/doc/book/pipeline/)

### 15.1: Ćwiczenie, Zainstalować wtyczki ``Blue Ocean``
``Blue Ocean (BlueOcean Aggregator)``  
![Blue Ocean 1](img/blueOcean_1.png)  
### 15.2: Scripted vs Declarative Pipeline
* Groovy jako podstawa
* Brak funkcjonalnych różnic, w obu podejściach można zrealizować te same funkcjonalności.
* Próg wejścia w podejściu Declarative jest dużo mniejszy, główny powód, dla którego został wprowadzony.
* Scripted jest dużo bardziej elastyczny.
* Declarative jest bardziej formalny.
* Declarative walidowany jest na starcie*.

### 15.3: First pipeline!
``Jenkins -> Nowy Projekt -> Pipeline (P_1)``
![Pipeline 1](img/pipeline_1.png)  
```groovy
properties([
            parameters([
                string(defaultValue: 'test_a', description: '', name: 'TEST', trim: false)
            ])
          ])
node {
    stage('First stage') {
        echo "Sii Power People"
    }
    stage("Environments") {
        echo env.PATH
        echo env.BUILD_ID
        echo env.JOB_URL
    }
    stage('Parameters') {
        echo params.TEST
    }
    stage('currentBuild') {
        echo currentBuild.displayName
        echo currentBuild.currentResult
        //error 'Cos poszło nie tak'
    }
}
```

``Jenkins -> Nowy Projekt -> Pipeline (P_2)``
```groovy
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
```
W przypadku deklaratywnego stylu mamy do dyspozycji ponowne uruchomienie pipelinu z dowolnego etapu.  
![Pipeline 2 Restart](img/pipeline_2.png)
![Pipeline 3 Restart](img/pipeline_3.png)

``Jenkins -> Nowy Projekt -> Pipeline (P_(3,4))``
```groovy
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
                //echo 1
                //message 'Test'
            }
        }
    }
}
//vs
node {
    stage('Build') {
        echo "Build ..."
    }
    stage("Test") {
        echo "Testing .."
        //echo 1
        //message 'Test'
    }
}
``` 
Declarative owszem jest walidowany na starcie, ale nie każdy przypadek.
### 15.4 Agent
* ``any`` pipeline może wykonany na dowolnym dostępnym agencie zgodnie z ustalonymi regułami
* ``none`` pipeline wykonywany jest na żadnym agencie  

``Jenkins -> Nowy Projekt -> Pipeline (P_5)``
```groovy
pipeline {
    agent none

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
            }
        }
    }
}

//next

pipeline {
    agent none

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'touch test.txt' //! próba utworzenia pliku spowoduje błąd
            }
        }
    }
}
```
Jeżeli w pipeline nie jest wykonywana żadna interakcja z agentem (zapis, odczyt itp.) wtedy taki pipeline może być uruchomiony z sukcesem
* ``docker`` jako agent użyty jest dowolny obraz dockerowy

``Jenkins -> Nowy Projekt -> Pipeline (P_6)``
```groovy
pipeline {
    agent {
        docker {
            image 'maven:3-alpine'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'mvn -v'
            }
        }
    }
}

//next

pipeline {
    agent {
        docker {
            image 'maven:3.6.0-jdk-12-alpine'
            args '-v $HOME/.m2:/root/.m2'
        }
    }
    stages {
        stage('Git'){
            steps {
                git branch: 'master', url: 'https://github.com/klimas7/restCounter.git'
            }
        }
        stage('Build') {
            steps {
                sh 'mvn clean install'
            }
        }
    }
}
```
* ``label`` agent przydzielany zgodnie z etykietą

``Jenkins -> Nowy Projekt -> Pipeline (P_7)``
```groovy
pipeline {
    agent {
        label 'Linux_1'
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
            }
        }
    }
}
```
### 15.5: Tools
``Jenkins -> Nowy Projekt -> Pipeline (P_8)``
```groovy
pipeline {
    agent any
    tools {
        maven 'mvn'
        jdk 'jdk8'
    }
    stages {
        stage('Stag1'){
            steps {
                sh 'java -version'
                sh 'mvn -version'
            }
        }
    }
}
//vs
pipeline {
    agent any
    tools {
        maven 'mvn'
        jdk 'jdk8'
    }
    stages {
        stage('Stage 1'){
            steps {
                sh 'java -version'
            }
        }
        stage('Stage 2'){
            tools {
                jdk 'jdk12'
            }
            steps {
                sh 'java -version'
            }
        }
    }
}
```
``Jenkins -> Nowy Projekt -> Pipeline (P_8_a)``
```groovy
node {
    stage("Stage 1") {
        def javaHome = tool name: 'jdk12', type: 'jdk'
        sh "${javaHome}/bin/java -version"
        
        def mavenHome = tool name: 'mvn', type: 'maven'
        sh "${mavenHome}/bin/mvn -version"
        
        withEnv(["PATH+JAVA=${tool name: 'jdk12', type: 'jdk'}/bin", 
                 "PATH+MAVEN=${tool name: 'mvn', type: 'maven'}/bin"]) {
            sh 'java -version'
            sh 'mvn -version'   
        }        
    }
}
```
### 15.6: Options
``Jenkins -> Nowy Projekt -> Pipeline (P_9)``
```groovy
pipeline {
    agent any
    tools {
        jdk 'jdk8'
    }
    options {
        timestamps()
        buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '2')
        timeout(time: 15, unit: 'SECONDS')
    }
    stages {
        stage('Stag1'){
            options {
                timeout(time: 10, unit: 'SECONDS')
            }
            steps {
                sleep 9
            }
        }
        stage('Stag2'){
            steps {
                sleep 15
            }
        }
    }
}
```
``Jenkins -> Nowy Projekt -> Pipeline (P_9_a)``
```groovy
properties([
    buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '2'))
])
node {
    timestamps {
        timeout(time: 15, unit: 'SECONDS') {
            stage("Stage 1") {
                def javaHome = tool name: 'jdk12', type: 'jdk'
                sh "${javaHome}/bin/java -version"
                timeout(time: 10, unit: 'SECONDS') {
                    sleep 9
                }
            }
            stage("Stage 2") {
                echo "Stage 2"
                sleep 3
            }
        }   
    }
}
```
### 15.7: Triggers
``Jenkins -> Nowy Projekt -> Pipeline (P_10)``
```groovy
pipeline {
    agent any
    triggers {
      cron '* * * * *'
      upstream 'p_9'
    }
    stages {
        stage('Stage 1') {
            steps {
                echo 'Stage 1'
                sleep 10
            }
        }
    }
}
```
``Jenkins -> Nowy Projekt -> Pipeline (P_10_a)``
```groovy
properties([
    pipelineTriggers([
        cron('* * * * *'), 
        upstream('p_9')
    ])
])
node {
    stage('Stage 1') {
        echo "Stage 1"
        sleep 10
    }
}
```
### 15.8: Condition
Dodać ``Global properties`` ``STAGE_1: false``  
``Jenkins -> Nowy Projekt -> Pipeline (P_11)``
```groovy
pipeline {
    agent any
    stages {
        stage('Stage 1') {
            when {
              environment name: 'STAGE_1', value: 'true'
            }
            steps {
                echo 'Stage 1'
                sleep 10
            }
        }
    }
}
```
``Jenkins -> Nowy Projekt -> Pipeline (P_11_a)``
```groovy
pipeline {
    agent any
    parameters {
        booleanParam defaultValue: false, description: 'Czy coś ma się deployować', name: 'deploy'
    }
    stages {
        stage('Build') {
            steps {
                echo 'Building ...'
            }
        }
        stage('Test') {
            steps {
                echo 'Test ...'
                unstable 'Cos poszło nie najlepiej'
            }
        }
        stage('Deploy') {
            when {
                expression {params.deploy && currentBuild.currentResult == "SUCCESS" }
            }
            steps {
                echo 'Deploying ...'
            }
        }
    }
}
```
``Jenkins -> Nowy Projekt -> Pipeline (P_11_b)``
```groovy
node {
    stage('Stage 0') {
        echo env.STAGE_1
    }
    if (env.STAGE_1 == "true") {
        stage('Stage 1') {
            echo "Stage 1"
            sleep 10
        }
    }
}
```
``Jenkins -> Nowy Projekt -> Pipeline (P_11_c)``
```groovy
properties([
    parameters([
        booleanParam(defaultValue: false, description: 'Czy coś ma się deployować', name: 'deploy')
    ])
])
node {
    stage('Build') {
        echo 'Building ...'
    }
    stage('Test') {
        echo 'Test ...'
        //unstable 'Cos poszło nie najlepiej'
    }
    if (params.deploy && currentBuild.currentResult == "SUCCESS") {
        stage('Deploy') {
            echo 'Deploying ...'
        }
    }
}
```
### 15.9: Parallel
``Jenkins -> Nowy Projekt -> Pipeline (P_12)``
```groovy
pipeline {
    agent none
    stages {
        stage('Run Tests') {
            parallel {
                stage('Test On Windows') {
                    agent {
                        label 'windows'
                    }
                    steps {
                        echo "Test on windows"
                        sleep 30
                    }
                }
                stage('Test On Linux') {
                    agent {
                        label "linux"
                    }
                    steps {
                        echo "Test on linux"
                        sleep 30
                    }
                }
            }
        }
    }
}
```
``Jenkins -> Nowy Projekt -> Pipeline (P_12_a)``
```groovy
pipeline {
    agent none
    stages {
        stage('Run Tests') {
            parallel {
                stage('Test On Windows') {
                    agent any
                    steps {
                        echo "Test on windows"
                        sleep 2
                        echo "currentResult: " + currentBuild.currentResult
                        echo "result: " + currentBuild.result
                    }
                }
                stage('Test On Linux') {
                    agent {
                        label "linux"
                    }
                    steps {
                        echo "Test on linux"
                        sleep 5
                        echo "currentResult: " + currentBuild.currentResult
                        echo "result: " + currentBuild.result
                        //error 'error'
                        //unstable 'unstable'
                    }
                }
            }
        }
        stage('Deploy') {
            agent any
            steps {
                echo 'Deploy ...'
                echo "currentResult: " + currentBuild.currentResult
                echo "result: " + currentBuild.result
            }
            post {
                always {
                    echo "currentResult: " + currentBuild.currentResult
                    echo "result: " + currentBuild.result
                }
            }
        }
    }
}
```
``Jenkins -> Nowy Projekt -> Pipeline (P_12_b)``
```groovy
stage('Run Tests') {
    parallel linux: {
        node('linux') {
            stage('Test On Linux') {
                echo "Test on linux"
                sleep 30
            }
        }
    },
    windows: {
        node('windows') {
            stage('Test On Windows') {
                echo "Test on windows"
                sleep 30
            }
        }
    }
}
```
### 15.10: In-process Script Approval
``Jenkins -> Nowy Projekt -> Pipeline (P_13)``
```groovy
pipeline {
    agent {
        label 'Linux_1'
    }
    stages {
        stage('Build') {
            steps {
                script {
                    readFile()
                }
            }
        }
    }
}


def readFile() {
    def fileContents = new File('/work/tag.txt').text
    echo fileContents
}
```
```
[Pipeline] {
Scripts not permitted to use new java.io.File java.lang.String. Administrators can decide whether to approve or reject this signature.
[Pipeline] }
```
``Jenkins -> Zarządzaj Jenkinsem -> In-process Script Approval``  
![In approval 1](img/in_approval_1.png)
![In approval 2](img/in_approval_2.png)
![In approval 3](img/in_approval_3.png)
### 15.11: Walidacja
```
ssh -l admin -p 8081 192.168.0.178 declarative-linter < Jenkinsfile
```
### 15.12: try-catch
``Jenkins -> Nowy Projekt -> Pipeline (P_14)``
```groovy
pipeline {

    agent any

    stages {
        stage ('Build & Test') {
            steps {
                sh 'echo Building... Failure here will fail the build'
                script {
                    try {
                        echo 'Running tests...'
                        sh 'exit 1'
                    }
                    catch (exc) {
                        echo "Message: " + exc.getMessage()
                        echo 'Testing failed!'
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
    }
}
```
### 15.13: RestCounter project
W pierwszej kolejności na naszej wirtualnej maszynie musimy otworzyć port `8088` w zaporze sieciowej
```bash
# as root
firewall-cmd --permanent --zone=public --add-port=8088/tcp
systemctl restart firewalld
firewall-cmd --list-all
```

``Jenkins -> Nowy Projekt -> Pipeline (RestCounter_pipeline)``
```groovy
pipeline {
    agent any
    tools {
        maven 'mvn'
        jdk 'jdk8'
    }
    stages {
        stage('Git'){
            steps {
                git branch: 'master', url: 'ssh://git@ovh.klimas7.pl:7999/lab/restcounter.git'
            }
        }

        stage ('Build') {
            steps {
                sh 'mvn clean install'
            }
            post {
                success {
                    archive 'target/*.jar'
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }
    }
}
```
Dodajemy opcje `deploy` wraz z etapem `Deploy`
```groovy
pipeline {
    agent any
    parameters {
        booleanParam defaultValue: true, description: 'Deploy and run application', name: 'deploy'
    }
    tools {
        maven 'mvn'
        jdk 'jdk8'
    }
    stages {
        stage('Git'){
            steps {
                git branch: 'master', url: 'ssh://git@ovh.klimas7.pl:7999/lab/restcounter.git'
            }
        }

        stage ('Build') {
            steps {
                sh 'mvn clean install'
            }
            post {
                success {
                    archive 'target/*.jar'
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }
        
        stage ('Deply') {
            when {
                expression { params.deploy }
            }
            steps {
                echo "Deploy application"
            }
        }
    }
}
```
Rozbudowujemy etap `Deploy`
```groovy
def applicationDir = '/opt/tools/restCounter'

pipeline {
    parameters {
      booleanParam defaultValue: true, description: 'Deploy and run application', name: 'deploy'
    }
    agent any
    tools {
        maven 'maven'
        jdk 'java8'
    }
    stages {
        stage('Git'){
            steps {
                git branch: 'master', url: 'ssh://git@ovh.klimas7.pl:7999/lab/restcounter.git'
            }
        }

        stage ('Build') {
            steps {
                sh 'mvn clean install'
            }
            post {
                success {
                    archive 'target/*.jar'
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }
        stage ('Deply') {
            when {
                expression { params.deploy }
            }
            steps {
                echo "Deploy application"
                sh "mkdir -p ${applicationDir}"
                sh "cp target/*.jar ${applicationDir}"
                sh "cp restCounter.sh ${applicationDir}"
            }
        }
    }
}
```
```bash
$ ll restCounter/
razem 17516
-rw-rw-r--. 1 jenkins jenkins 17928440 11-20 14:15 restCounter.jar
-rwxrwxr-x. 1 jenkins jenkins      556 11-20 14:15 restCounter.sh
```
Startujemy naszą aplikację
```groovy
def applicationDir = '/opt/tools/restCounter'

pipeline {
    agent any
    parameters {
        booleanParam defaultValue: true, description: 'Deploy and run application', name: 'deploy'
    }
    tools {
        maven 'mvn'
        jdk 'jdk8'
    }
    stages {
        stage('Git'){
            steps {
                git branch: 'master', url: 'ssh://git@ovh.klimas7.pl:7999/lab/restcounter.git'
            }
        }

        stage ('Build') {
            steps {
                sh 'mvn clean install'
            }
            post {
                success {
                    archive 'target/*.jar'
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }
        
        stage ('Deply') {
            when {
                expression { params.deploy }
            }
            steps {
                echo "Deploy application"
                sh "mkdir -p ${applicationDir}"
                sh "cp target/*.jar ${applicationDir}"
                sh "cp restCounter.sh ${applicationDir}"
                dir("${applicationDir}") {
                    sh "${applicationDir}/restCounter.sh stop"
                    sh "${applicationDir}/restCounter.sh start &"
                    sleep 120
                }
            }
        }
    }
}
```
Sprawdzamy wynik [http://192.168.0.178:8088/api/count/xyz](http://192.168.0.178:8088/api/count/xyz)  
Niestety nasza aplikacja będzie działała tylko przez 2 minuty! [ProcessTreeKiller](https://wiki.jenkins.io/display/JENKINS/ProcessTreeKiller)
Rozwiążmy ten problem i dodajmy sprawdzanie budowania
```groovy
def applicationDir = '/opt/tools/restCounter'

pipeline {
    agent any
    
    parameters {
        booleanParam defaultValue: true, description: 'Deploy and run application', name: 'deploy'
    }
    
    tools {
        maven 'mvn'
        jdk 'jdk8'
    }
    
    triggers {
        pollSCM '*/5 * * * *', ignorePostCommitHooks: true
    }
    
    stages {
        stage('Git'){
            steps {
                git branch: 'master', url: 'ssh://git@ovh.klimas7.pl:7999/lab/restcounter.git'
            }
        }

        stage ('Build') {
            steps {
                sh 'mvn clean install'
            }
            post {
                success {
                    archive 'target/*.jar'
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }
        
        stage ('Deply') {
            when {
                expression { params.deploy }
            }
            steps {
                echo "Deploy application"
                sh "mkdir -p ${applicationDir}"
                sh "cp target/*.jar ${applicationDir}"
                sh "cp restCounter.sh ${applicationDir}"
                dir("${applicationDir}") {
                    //sh "${applicationDir}/restCounter.sh stop"
                    //sh "${applicationDir}/restCounter.sh start &"
                    //sleep 120
                    sh "export JENKINS_NODE_COOKIE=REST_COUNTER; ${applicationDir}/restCounter.sh start &"
                }
            }
        }
    }
}
```
Sprawdzamy wynik [http://192.168.0.178:8088/api/count/xyz](http://192.168.0.178:8088/api/count/xyz)
## 16: Shared Library
Pozwalają wyodrębnić oraz współdzielić wspólne części pomiędzy wieloma potokami.
Elementy takie mogą być zamknięte w bibliotece przechowywanej w repozytorium kodu.

Struktura
```bash
├── README.md
├── src                                 (Groovy source files)
│   └── pl
│       └── klimas7
│           └── jenkins
│               ├── Deployer.groovy
│               └── Rectangle.groovy
├── vars                                (Exposed variables)
│   ├── checkStatus.groovy
│   ├── deploy.groovy
│   ├── disableThrottling.groovy
│   ├── enableThrottling.groovy
│   └── printBuildinfo.groovy
└── resources                           (resource files)
    └── pl
        └── klimas7
            └── jenkins
                └── static_content.json
    
```
``src`` Standardowy katalog znany z projektów javy. Jest dodawany do classpath w trakcie wykonania potoku.  
``vars`` Definicje zmiennych, które są dostępne w potoku.  
Przykład [jenkins-shared-lib](https://github.com/klimas7/jenkins-shared-lib).  
Dodanie nowej biblioteki do Jenkinsa.  
``Jenkins -> Zarządzaj Jenkinsem -> Skonfiguruj system -> Global Pipeline Libraries``
![Shared lib](img/shared-lib-1.png)  
* Name: jenkins-shared-lib
* Default version: master
* Retrieval method: Modern SCM
* Select the Git type
* Project repository: https://github.com/klimas7/jenkins-shared-lib.git
* Credentials: (leave blank)

Nowy projekt wykorzystujący przygotowaną bibliotekę.  
``Jenkins -> Nowy Projekt -> Pipeline (JenkinsSharedLib)``  
Proste wykorzystanie
```groovy
@Library('jenkins-shared-lib')_

stage('Print Build Info') {
    printBuildinfo {
        name = "Sample Name"
    }
} stage('Disable throttling') {
    disableThrottling()
} stage('Deploy') {
    deploy()
} stage('Enable throtling') {
    enableThrottling()
} stage('Check Status') {
    checkStatus()
}
```
Hint! ``@Library('jenkins-shared-lib')_`` ``_`` nie jest pomyłką.  
Przykład z parametrami
```groovy
@Library('jenkins-shared-lib')_

pipeline {
    parameters {
        string defaultValue: 'One default', description: '', name: 'param1', trim: false
        string defaultValue: 'Two default', description: '', name: 'param2', trim: false
    }
    agent any
    
    stages {
        stage('Print Build Info') {
            steps {
                script {
                    printBuildinfo {
                        name = "Sample Name"
                    }
                }
            }
        }
        stage('Disable throttling') {
            steps {
                script {
                    disableThrottling()
                }
            }
        }
        stage('Deploy') {
            steps {
                script { 
                    deploy()
                }
            }
        }
        stage('Enable throtling') {
            steps {
                script {
                    enableThrottling()
                }
            }
        }
        stage('Check Status') {
            steps {
                script {
                    checkStatus()
                }
            }
        }
    }
}
```
### 16.1: Ćwiczenie 
Wykorzystać przygotowaną bibliotekę w przykładowym potoku, prosty skrypt bez parametrów.
### 16.2: Ćwiczenie*
Wykorzystać przygotowaną bibliotekę w przykładowym potoku, pełen skrypt z użyciem konwencji potoku i parametrów.
## 17: Bitbucket integration
Należy zainstalować wtyczki `Bitbucket Server Integration`, `Bitbucket Server Notifier` 
### 17.1 Hook oraz notyfikacja
#### Konfiguracja po stronie repozytorium
![Bitbucket 1](img/Bitbucket_1.png)  
#### Konfiguracja po stronie Jenkinsa oraz projektu
``Dashboard -> Zarządzaj Jenkinsem -> Skonfiguruj system -> Bitbucket Server Notifier``
![Bitbucket 2](img/Bitbucket_2.png)  
![Bitbucket 3](img/Bitbucket_3.png)  

## Koniec