/**
 * Created by holland on 4/30/16.
 */

function DdbManager () {
    var AWS = require("aws-sdk");
    AWS.config.update({
        region: "us-west-2",
        endpoint: "https://dynamodb.us-west-2.amazonaws.com"
    });
    var docClient = new AWS.DynamoDB.DocumentClient();
    var tableName = "BrewTempSensor";

/*
 ":t1": "1462048140000",
 ":t2": "1462048279999"
 */

    this.getDateTimeRange = function(timeStart, timeEnd){
        var params = {
            TableName: tableName,
            KeyConditionExpression: "#dt between :t1 and :t2",
            ExpressionAttributeNames:{
                "#dt": "DateTime"
            },
            ExpressionAttributeValues: {
                ":t1": timeStart,
                ":t2": timeEnd
            }
        };

        docClient.get(params, function(err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            }
        });
    };
}