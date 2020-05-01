module.exports = {
  apps : [{
    name: 'app',
    script: './bin/www',
    instances: 0,
    autorestart: true,
    watch: true,
    ignore_watch: [ // 不⽤监听的⽂件
    "node_modules",
    "logs"
    ],
    max_memory_restart: '1G',
    "error_file": "./logs/app-err.log", // 错误⽇志⽂件
    "out_file": "./logs/app-out.log",
    "log_date_format": "YYYY-MM-DD HH:mm:ss", // 给每⾏⽇志标记⼀个时间
    env: {
    NODE_ENV: 'development'
    },
    env_production: {
    NODE_ENV: 'production'
    }
    }],

  deploy : {
    production : {
      user : 'root',
      host : '114.215.24.231',
      ref  : 'origin/master',
      repo : 'git@github.com:qinyuhong/blogServer.git',
      path : '/usr/local/myProject',
      ssh_options: "StrictHostKeyChecking=no",
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      "env": {
        "NODE_ENV": "production"
        }
    }
  }
};
