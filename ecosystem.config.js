module.exports = {
  apps : [{
    name: 'pi-mailer-tester',
    script: 'yarn',
    args: 'start',
    env: {
      NODE_ENV: 'production'
    }
  }],
  deploy: {
    production: {
      user: 'mrs4z', // Your server user
      host: 'ali33.ru', // Your server IP
      ref: 'origin/main',
      repo: 'git@gitlab.com:whoami1337/pi-mailer-tester.git', // Your repo link
      path: '/home/mrs4z/www/pi-mailer', // The path to deploy to
      'pre-deploy-local': '',
      'post-deploy': 'yarn install --production=false --check-files && yarn build && pm2 reload ecosystem.config.js',
      'pre-setup': 'mkdir -p /home/mrs4z/www/pi-mailer/source',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};
