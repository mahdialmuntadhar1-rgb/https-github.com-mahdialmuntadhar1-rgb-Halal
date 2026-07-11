function json(data, status = 200, headers = {}) {

    return new Response(
        JSON.stringify(data),
        {
            status,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
                ...headers
            }
        }
    );

}

function success(data = {}, message = "OK") {

    return json({
        success: true,
        message,
        data
    });

}

function error(message = "Error", status = 400) {

    return json({
        success: false,
        message
    }, status);

}

module.exports = {
    json,
    success,
    error
};
