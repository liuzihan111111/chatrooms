/* 构建http服务 */
var app = require('http').createServer()
/* 引入socket.io */
var io = require('socket.io')(app)

// 定义监听端口，
var port = 3000;

// 监听端口
app.listen(port)

// 定义用户数组
var users = []

/**
 * 监听客户端连接
 * io是我们定义的服务端的socket
 * 回调函数里面的socket是本次连接的客户端socket
 * io与socket是一对多的关系
 */
io.on('connection', function (socket) {
    /* 所有的监听on，与发送的emit都得写在连接里面，包括断开连接 */

    /* 是否是新用户 */
    var isNew = true;

    /*当前登录用户*/
    var username = null;

    /*监听登录 */
    socket.on('login', function (data) {
        console.log(data);
        users.forEach(item => {
            if (item.username == data.username) {
                isNew = false;
                return
            } else {
                isNew = true;
            }
        })
        if (isNew) {
            username = data.username
            users.push({
                username: data.username
            })
            /* 登录成功 */
            socket.emit('loginSuccess', data)
            /* 向所有连接的客户端广播add事件 */
            io.sockets.emit('add', data)
        } else {
            /* 登陆成功 */
            socket.emit('loginFail', "")
        }
    })

    /* 退出登录 */
    /* 退出登录，只需在服务器端的用户列表中删除用户即可 */

    socket.on('disconnect', function () {
        /* 向所有连接的客户端广播leave事件 */
        io.sockets.emit('leave', username)
        users.map(function (val, index) {
            if (val.username == username) {
                users.splice(index, 1)
            }
        })
    })

    /*接收消息*/
    socket.on('sendMessage', function (data) {
        io.sockets.emit('receiveMessage', data)
    })
})

console.log('监听端口' + port)