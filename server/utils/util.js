//时间戳转换为时间
export const resolutionTime = (timestamp) => {
    timestamp = timestamp + "";
    if (timestamp.length > 13) {
        timestamp = timestamp.slice(0, 13);
        timestamp = Number(timestamp);
    }
    //获取当前时间
    var now = new Date();
    //根据指定时间戳转换为时间格式
    var time = new Date();
    time.setTime(timestamp);
    //比较当前时间和指定时间的差来决定显示时间格式
    //1.年份与当前不同则显示完整日期 yyyy-MM-dd hh:mm
    if (time.getFullYear() != now.getFullYear())
        return (
            time.getFullYear() +
            "-" +
            (time.getMonth() + 1 < 10
                ? "0" + (time.getMonth() + 1)
                : time.getMonth() + 1) +
            "-" +
            (time.getDate() < 10 ? "0" + time.getDate() : time.getDate()) +
            " " +
            (time.getHours() < 10 ? "0" + time.getHours() : time.getHours()) +
            ":" +
            (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes())
        );
    //2.年份与当前相同但月份或日期不同时 显示 MM-dd hh:mm格式
    else if (time.getMonth() != now.getMonth() || time.getDate() != now.getDate())
        return (
            (time.getMonth() + 1 < 10
                ? "0" + (time.getMonth() + 1)
                : time.getMonth() + 1) +
            "-" +
            (time.getDate() < 10 ? "0" + time.getDate() : time.getDate()) +
            " " +
            (time.getHours() < 10 ? "0" + time.getHours() : time.getHours()) +
            ":" +
            (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes())
        );
    //3.年份与日期均与当前相同时，显示hh:mm格式
    else
        return (
            (time.getHours() < 10 ? "0" + time.getHours() : time.getHours()) +
            ":" +
            (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes())
        );
};