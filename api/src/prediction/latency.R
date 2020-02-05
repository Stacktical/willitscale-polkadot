predictLatency <- function (jsonObj) {
    options(scipen = 999)
    library(jsonlite)

	campaign <- fromJSON(jsonObj)
	names(campaign)
    print(campaign, row.names = FALSE)
    cat("\n\n")

    # Extract p and Rt from R JSON object
	p <- campaign$points$p
	Rt <- campaign$points$Rt

    # Extract first Rt value as lamba coefficient
    lambda <- campaign$points$Rt[1]

    # Set customer chart size
    chartSize <- max(p)*2

    # Solve USL for Rt as a function of p
    little <- nls(Rt ~ (1 + A * (p-1) + B * p * (p-1))/lambda, data=campaign$points, start=c(A=0.1, B=0.01), algorithm="plinear")

    # Resize, fit and return prediction
    chart <-  with(campaign$points, expand.grid(p=seq(min(p), chartSize, length=chartSize)))
    chart$fit <- predict(little, newdata=chart)

    # Curate results into a list response body
    result <- list(
        campaign = campaign$points,
        chart = chart,
        little = chart$fit
    )

    print(result)
    cat("\n\n")
    
    response <- serializeJSON(result)

    return(response)
}
