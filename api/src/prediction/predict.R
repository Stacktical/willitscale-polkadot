makePrediction <- function (jsonObj) {
    options(scipen = 999)
    library(jsonlite)

	campaign <- fromJSON(jsonObj)
	names(campaign)
    print(campaign, row.names = FALSE)
    cat("\n\n")

    # Extract p from R JSON object
	p <- campaign$point
    little <- campaign$fit

    prediction <- predict(fit, newdata=data.frame(p=p))

    result <- list(
        p = campaign$p,
        data = data,
        prediction = prediction
    )

    response <- serializeJSON(result)

    return(response)
}
