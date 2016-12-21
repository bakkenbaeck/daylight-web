# Daylight.today

## Certificate install

```
brew install certbot
sudo certbot certonly --manual
```

Enter in: `daylight.today`

The terminal will print out a bunch of stuff including:

```
Make sure your web server displays the following content at
http://daylight.today/.well-known/acme-challenge/xxxxxxxxxxxx before continuing:
xxxxxxxxxxxx-yyyy.zzzzzzzzzzzzzzzzzzz
```

Go to https://dashboard.heroku.com/apps/daylight-web/settings, and in the `Config Variables` section, click the `Reveal Config Vars` button.

click the edit button on the `LETSENCRYPT_TOKEN` variable, and copy the `xxxxxxxxxxxx-yyyy.zzzzzzzzzzzzzzzzzzz` string into it, and save.

Go back to the terminal and hit ENTER to continue the verification.

If verification was successful run:
```
sudo heroku certs:update /etc/letsencrypt/live/daylight.today/fullchain.pem /etc/letsencrypt/live/daylight.today/privkey.pem
```
