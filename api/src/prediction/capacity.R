predictCapacity <- function (jsonObj) {
    options(scipen = 999)
    library(jsonlite)
    library(nlmrt)
    library(nls2)

	campaign <- fromJSON(jsonObj)
	names(campaign)
    print(campaign, row.names = FALSE)
    cat("\n\n")

    # Extract p and Xp from R JSON object
	p <- campaign$points$p
	Xp <- campaign$points$Xp

    # Duplicate dataset
    model <- campaign$points

    # Calculate scale factor: get throughput for entry where load = 1 (lambda, in Little's law)
    scale.factor <- campaign$points$Xp[1]

    # Rename columns
    names(model) <- c("load", "throughput")

    # Normalize data (cf. GCaP chapter 5.4) / Compute deviations from linearity (cf. GCaP chapter 5.5.2)
    model$capacity <- model$throughput / scale.factor
    model$x <- model$load - 1
    model$y <- (model$load / model$capacity) - 1
    model.fit <- lm(y ~ I(x^2) + x - 1, data = model)

    # Calculate alpha and beta value from linear deviation
    alpha <- coef(model.fit)[[2]] - coef(model.fit)[[1]]
    beta <- ifelse(coef(model.fit)[[1]]<0, 0, coef(model.fit)[[1]])

    # Set lm coefficients to 0 when they're negative
    if (alpha<0) {
        cat("alpha is negative, setting to 0... \n")
        cat(alpha)
        alpha <- 0
        cat("Done! \n\n")
    }

    if (beta<0) {
        cat("beta is negative, setting to 0... \n")
        cat(beta)
        beta <- 0
        cat("Done! \n\n")
    }

    cat("lm alpha:\n")
    cat(alpha)
    cat("\n\n")

    cat("lm beta:\n")
    cat(beta)
    cat("\n\n")

	# Apply non linear regression using computed alpha and beta value from linear deviation

    # Port implementation
    fit.nlsPo <- nls(Xp ~ scale.factor * p/(1 + A * (p-1) + B * p * (p-1)), data=campaign$points, start=c(A=alpha, B=beta), algorithm="port")

    sigma.nlsPo <- coef(fit.nlsPo)['A']
    cat("Initial sigma (nlsPo): \n")
    cat(sigma.nlsPo)
    cat("\n\n")

    kappa.nlsPo <- coef(fit.nlsPo)['B']
    
    cat("Initial kappa (nlsPo): \n")
    cat(kappa.nlsPo)
    cat("\n\n")

    peak.nlsPo <- sqrt((1 - sigma.nlsPo) / kappa.nlsPo)
  
    cat("Peak (nlsPo): \n")
    cat(peak.nlsPo)
    cat("\n\n")

    # Plinear implementation
    fit.nlsPl <- nls(Xp ~ scale.factor * p/(1 + A * (p-1) + B * p * (p-1)), data=campaign$points, start=c(A=alpha, B=beta), algorithm="plinear")

    sigma.nlsPl <- coef(fit.nlsPl)['A']
 
    cat("Initial sigma (nlsPl): \n")
    cat(sigma.nlsPl)
    cat("\n\n")

    kappa.nlsPl <- coef(fit.nlsPl)['B']

    cat("Initial kappa (nlsPl): \n")
    cat(kappa.nlsPl)
    cat("\n\n")

    peak.nlsPl <- sqrt((1 - sigma.nlsPl) / kappa.nlsPl)
  
    cat("Peak (nlsPl): \n")
    cat(peak.nlsPl)
    cat("\n\n")

    # nlxb + nls2 implementation
    fit.nlxb <- nlxb(Xp ~ scale.factor * p/(1 + A * (p-1) + B * p * (p-1)),
                    data = campaign$points,
                    start = c(scale.factor = 0, A = 0, B = 0),
                    lower = c(scale.factor = 0, A = 0, B = 0),
                    upper = c(scale.factor = Inf, A = 1, B = 1)
                )

    sigma.nlxb <- fit.nlxb$coefficients['A']
    kappa.nlxb <- fit.nlxb$coefficients['B']

    # nlxb nls2 pass (necessary for predict())
    fit.nls2 <- nls2(Xp ~ scale.factor * p/(1 + A * (p-1) + B * p * (p-1)), data = campaign$points, start = fit.nlxb$coefficients, algorithm = "brute-force")

    # Default USL is (more robust) nlxb + nls2 implementation
    usl <- fit.nls2
    implementation <- "nlxb"

    cat("Initial sigma (nlxb): \n")
    cat(sigma.nlxb)
    cat("\n\n")

    cat("Initial kappa (nlxb): \n")
    cat(kappa.nlxb)
    cat("\n\n")

    peak.nlxb <- sqrt((1 - sigma.nlxb) / kappa.nlxb)
    cat("Peak (nlsPl): \n")
    cat(peak.nlxb)
    cat("\n\n")

    # Switch to nlsPl implementation when we detect a negative nlxb coefficient
    if (kappa.nlxb<0 || sigma.nlxb<0) {
        cat("kappa is negative, moving to nlsPl implementation. \n")
        cat("Adjusted sigma (nlsPl): \n")
        cat(sigma.nlsPl)
        cat("\n\n")

        cat("Adjusted kappa (nlsPl): \n")
        cat(kappa.nlsPl)
        cat("\n\n")

        usl <- fit.nlsPl
        implementation <- "nlsPl"
    }

    # Switch to nlsPo implementation when we detect a negative nlsPl coefficient
    if (kappa.nlsPl<0 || sigma.nlsPl<0) {
        cat("kappa is negative, moving to nlsPo implementation. \n")
        cat("Adjusted sigma (nlsPo): \n")
        cat(sigma.nlsPo)
        cat("\n\n")

        cat("Adjusted kappa (nlsPo): \n")
        cat(kappa.nlsPo)
        cat("\n\n")

        usl <- fit.nlsPo
        implementation <- "nlsPo"
    }

    cat("Computed implementation: \n")
    cat(implementation)
    cat("\n\n")

    # Get sigma and kappa parameters from computed USL
    coefficients <- coef(usl)
    sigma <- coefficients['A']
    kappa <- coefficients['B']

    # Set coefficient to 0 when they're still negative
    if (sigma<0) {
        cat("sigma is still negative: \n")
        cat(sigma)
        cat("\n\n")
    }

    if (kappa<0) {
        cat("kappa is still negative: \n")
        cat(kappa)
        cat("\n\n")
    }

    cat("Final sigma:\n")
    cat(sigma)
    cat("\n\n")

    cat("Final kappa:\n")
    cat(kappa)
    cat("\n\n")

    # Calculate final peak scalability
    peak <- sqrt((1 - sigma) / kappa)

    cat("Final peak scalability:\n")
    cat(peak)
    cat("\n\n")

    # Calculate degree of freedom
	samples <- dim(campaign$points)[1]
	degfree <- samples - 1

    # Calculate confidence interval (error bands)
    y.usl <- predict(usl)
    y.mu  <- mean(campaign$points$Xp)
    y.se  <- sqrt(sum((campaign$points$Xp-y.usl)^2) / degfree)
    sse   <- sum((campaign$points$Xp-y.usl)^2)
    sst   <- sum((campaign$points$Xp-y.mu)^2)
    y.r2  <- 1 - sse / sst
    y.ci  <- y.se * qt(0.95, degfree)

    cat("Fit accuracy:\n")
    cat(y.r2)
    cat("\n\n")

    cat("Confidence interval:\n")
    cat(y.ci)
    cat("\n\n")

    chartSize <- max(p)*3

    # Resize, fit and return scalability prediction
    chart <- with(campaign$points, expand.grid(p=seq(min(p), chartSize, length=chartSize)))
    chart$fit <- predict(usl, newdata=chart)
    chart$ucl <- chart$fit + y.ci
    chart$lcl <- chart$fit - y.ci

    result <- list(
        campaign = campaign$points,
        chart = chart,
        usl = chart$fit,
        ymax = chart$ucl,
        ymin = chart$lcl,
        sigma = sigma,
        kappa = kappa,
        peakP = peak,
        peakXp = max(chart$fit),
        rsquared = y.r2
    )

    response <- serializeJSON(result)

    return(response)
}