const   mongoose                    = require("mongoose"),
        bodyParser                  = require("body-parser"),
        express                     = require("express"),
        passport                    = require("passport"),
        localStrategy               = require("passport-local"),
        passportLocalMongoose       = require("passport-local-mongoose"),
        User                        = require("./models/user");
        app                         = express();

mongoose.connect("mongodb://localhost/authNodeApp", {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Huskys are the most beautiful dogs in the word",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/secret", (req, res)=>{
    res.render("secret");
});

app.get("/register", (req, res)=>{
    res.render("register");
});

app.post("/register", (req, res)=>{
    User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{
        if(err){
            console.error(err);
            return res.render("register");
        }else{
            passport.authenticate("local")(req, res, ()=>{
                res.redirect("/secret");
            });
        }
    });
});

app.listen(3000, ()=>{
    console.log("server is starting on port 3000");
});