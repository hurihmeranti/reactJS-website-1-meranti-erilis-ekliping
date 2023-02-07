const express = require("express")

const flash = require('express-flash');

const session = require('express-session');

const bcrypt = require('bcrypt');

const multer = require('multer');

const app = express();

const PORT = 9000;  

const db = require('./connection/db');  



app.set("view engine", "hbs");

app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({extended : false}));

let isLogin = true;

// let releaseOnline = [
//     {
//         title : "Konsep Routing dengan router mikrotik extreme",
//         describe : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
//         author : "Suhairi",
//         postAt : '24 May 2022 13:58 WIB'
//     }
// ]

// let klipingOnline = [
//     {
//         titleonlineKliping : 'HUMAS & PROKOPIM',
//         describeonlineKliping : 'prokompim kabupaten kepulauan Meranti Provinsi Riau',
//         authoronlineKliping: 'heri',
//         postAt: '25 May 2022 10:03 WIB',
//         linkkonlineKliping: 'www.merantikab.com',
//         mediaonlineKliping : 'riaupos.com'
//     }
// ]

// let klipingCetak = [
//     {
//         titlecetakKliping : 'bupati dan wakil kunjungan ke kedaburapat kecamatan rangsang pesisir',
//         describecetakKliping : 'bupati berserta wakil bupati melakukan kunjungan kerja di kedaburapat kecamatan rangsang Pesisir',
//         authorcetakKliping : 'jang',
//         mediacetakKliping : "riauPos Koran",
//         postAt : '26 May 2022 14:14 WIB',
//     }
// ] 
// console.log(klipingCetak)

// console.log(releaseOnline);

app.use(flash())
app.use(
    session({
        cookie: {
            maxAge: 2 * 60 * 60 * 1000,  //= 2 jam 
            secure: false,
            httpOnly: true
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave: false,
        secret: 'secretValue'

}))

function getfullTime(time) {
    let month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktobebr", "November", "Desember"];

    let date = time.getDate();
  
    let monthIndex = time.getMonth();
    
    let year = time.getFullYear();
   
    let hours = time.getHours();
  
    let minutes = time.getMinutes();
  
    return `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`
  }


app.get("/", function(request, response){
    response.render("index");
})

app.post("/", function(request, response){
    response.redirect("/");
})



app.get('/kliping_online', function(request, response){

    // let dataklipingOnline = klipingOnline.map(function(onlineKliping){
    //     return {
    //         ...onlineKliping,
    //         isLogin : isLogin,    
    //     }
    // })
    // console.log(dataklipingOnline)

    db.connect(function(err, client){
        if (err) throw err;

        client.query(`SELECT * FROM kliping_online_tb `, function(err, result){
            if (err) throw err;

            console.log(result.rows);

            let dataklipingOnline = result.rows

            dataklipingOnline = dataklipingOnline.map(function(onlineKliping){
                return {
                    ...onlineKliping,
                    postAt : getfullTime(onlineKliping.postAt),
                    isLogin : isLogin,
                    
                }
            })

            response.render("kliping_online", {isLogin: isLogin, klipingOnline : dataklipingOnline});
            
        })
    }) 

})

app.post("/kliping_online", function(request , response){

    // let onlineKliping = request.body;

    // onlineKliping = {
    //     titleonlineKliping : onlineKliping.titleklipingOnline,
    //     authoronlineKliping : onlineKliping.authorklipingOnline,
    //     describeonlineKliping : onlineKliping.describeklipingOnline,
    //     postAt : new Date(),
    //     linkonlineKliping : onlineKliping.linkKliping,
    //     mediaonlineKliping : onlineKliping.mediaklipingOnline,
    // }

    // klipingOnline.push(onlineKliping)
    // console.log(onlineKliping);
    let onlineKliping = request.body

    db.connect(function(err, client, done){
        if (err) throw err;

        client.query(`INSERT INTO kliping_online_tb (titleonline, authoronline, describeonline, mediaonline, linkonline, imageonline) VALUES ('${onlineKliping.titleklipingOnline}', '${onlineKliping.authorklipingOnline}', '${onlineKliping.describeklipingOnline}', '${onlineKliping.mediaklipingOnline}', '${onlineKliping.linkKliping}',  'pemkab-meranti09.png' )`, function (err, result){
            if (err) throw err
            
            response.redirect("/kliping_online");
          
        })
    
    })

})

app.get('/kliping_cetak', function(request, response){

    // let datacetakKliping = klipingCetak.map(function (cetakKliping){
    //     return {
    //         ...cetakKliping,
    //         isLogin: isLogin,
    //     }
    // })
    // console.log(datacetakKliping)

    db.connect(function(err, client, done ){

        if (err) throw err;

        client.query(`SELECT * FROM kliping_cetak_tb`, function (err, result){
            if (err) throw err;
    
            console.log(result.rows)
            
            let datacetakKliping = result.rows;

            datacetakKliping = datacetakKliping.map(function(cetakKliping){
                return {
                    ...cetakKliping,
                    postAt : getfullTime(cetakKliping.postAt),
                    isLogin : isLogin
                }
            })

            response.render("kliping_cetak", {isLogin : isLogin, klipingCetak : datacetakKliping });
        })
    })
})

app.post("/kliping_cetak", function(request , response){
    
    let cetakKliping = request.body;

    db.connect(function(err, client, done){
        if (err) throw err;

        client.query(`INSERT INTO kliping_cetak_tb (titlecetak, authorcetak, mediacetak,  describecetak, imagecetak) VALUES ('${cetakKliping.titleklipingCetak}', '${cetakKliping.authorklipingCetak}', '${cetakKliping.mediaklipingCetak}' , '${cetakKliping.describeklipingCetak}',  'kedaburapat.jpeg' )`, function (err, result){
            if (err) throw err;
            
            response.redirect("/kliping_cetak");
        
        })
    })

})    // cetakKliping = {
    //     titlecetakKliping : cetakKliping.titleklipingCetak,
    //     authorcetakKliping : cetakKliping.authorklipingCetak,
    //     describecetakKliping : cetakKliping.describeklipingCetak, 
    //     postAt : new Date(), 
    //     mediacetakKliping : cetakKliping.mediaklipingCetak
       
    // }

    // klipingCetak.push(cetakKliping)
    // console.log(cetakKliping)
   


app.get("/release_online", function(request, response){
    // let dataRelease = releaseOnline.map(function(release) {
    //     return {
    //         ...release,
    //         isLogin : isLogin,

    //     }
    // })
    // console.log(dataRelease)

    db.connect(function(err, client, done ){

        if (err) throw err;

        client.query(`SELECT * FROM release_tb`, function (err, result){
            if (err) throw err;

            console.log(result.rows);

            let dataRelease = result.rows;

            dataRelease = dataRelease.map(function(releaseData){
                return {
                    ...releaseData,
                    postAt : getfullTime(releaseData.postAt),
                    isLogin : isLogin
                }
            })

            response.render("release_online", {isLogin : isLogin, releaseOnline : dataRelease});
        })
    })

})

app.post("/release_online", function(request, response){
    
    // release = {
        //     title : release.titleRelease,
        //     author : release.authorRelease,
        //     describe : release.describeRelease, 
        //     postAt : new Date()
        
        // }
        // releaseOnline.push(release)
        // console.log(release);   
    let release = request.body

    db.connect(function(err, client, done){
        if (err) throw err;

        client.query(`INSERT INTO release_tb(author, title, describe, image) VALUES ('${release.authorRelease}', '${release.titleRelease}' , '${release.describeRelease}',  'pemkab-meranti09.png' )`, function (err, result){
            if (err) throw err;
            
            response.redirect("/release_online");
          
        })
    
    })
})


app.get("/details-release/:id", function(request, response){
   
    let idRelease = request.params.id

    db.connect(function(err, client, done){
        if (err) throw err;

        client.query(`SELECT * FROM release_tb WHERE id = ${idRelease}`, function (err, result){
            if (err) throw err;
            
            let dataRelease = result.rows[0];

            console.log(dataRelease);
            
            response.render("details-release", {release : dataRelease})
        })
    
    })
    // response.render('details-release', {release : {
    //     id : releaseId,
    //     title : "Hallo Riau Indonesia",
    //     author : 'suhairi',
    //     describe : "belajar adalah kunci sebuah kesuksesan dan sabar adalah tinta emas yang berharga dan bernilai",
    //     postAt : "25 May 2022 22:20 WIB"
    // }})
  
    // console.log(request.params);
    // let releaseId = request.params.id;

    // response.render("details-release", {release : {
    //     id : releaseId,
        //     authorRelease : "ra66it12",
    //     titleRelease: "website Prokopim Kabupaten Kepulauan Meranti",
    //     describeRelease : "Selamat datang di prokopim meranti website yang di bangun untuk kepentingan bersama"
    // }});
})

app.post("/details-release", function(request, response){
    response.redirect("/details-release");
})

app.get("/details-kliping/:id", function(request, response){
    // response.render("details-kliping");
    let klipingonlineId = request.params.id

    db.connect(function(err, client, done){
        if (err) throw err;

        client.query(`SELECT * FROM kliping_online_tb WHERE id = ${klipingonlineId}`, function (err, result){
            if (err) throw err;
            
            let dataklipingOnline = result.rows[0];
            
            console.log(dataklipingOnline);
            
            response.render("details-kliping", {onlineKliping : dataklipingOnline})
        })
    
    })
    // response.render('details-kliping-online', {klipingOnline : {
    //     id : klipingonlineId,
    //     title : "Berita Terkini",
    //     author : 'jang heri',
    //     describe : "pembangunan untuk website kliping release kabupaten kepulauan meranti",
    //     postAt : "27 May 2022 15:00 WIB",
    //     linkklipingOnline : "www.detik.com",
    //     mediaklipingOnline: "riaupos"
    // }})
})

app.post("/details-kliping", function(request, response){
    response.redirect("/details-kliping");
})

app.get("/details-kliping-cetak/:id", function(request, response){

    let klipingCetakId = request.params.id

    db.connect(function(err, client, done){
        if (err) throw err;

        client.query(`SELECT * FROM kliping_cetak_tb WHERE id = ${klipingCetakId}`, function (err, result){
            if (err) throw err;
            
            let datacetakKliping = result.rows[0];
            
            console.log(datacetakKliping);
            
            response.render("details-kliping-cetak", {klipingCetak : datacetakKliping})
        })
    
    })
    // response.render("details-kliping-cetak", {klipingCetak :{
    //     id: klipingCetakId,
    //     authorklipingCetak : "suhairi",
    //     titleklipingCetak : "masa depan barista keren",
    //     describeklipingCetak : "Banyak Orang sekarang beranggapan kalo barista itu memiliki masa depan yang cerah dan keren merupakan perkerjaan impian anak muda yang suka ngopi"  
    // }});
})

app.post("/details-kliping-cetak", function(request, response){
    response.redirect("/details-kliping-cetak");
})

app.get("/add-release", function(request, response){
    response.render("add-release");
})

app.post("/add-release", function(request, response){
    response.redirect("/add-release");
})

app.get("/add-kliping-cetak", function(request, response){
    response.render("add-kliping-cetak");
})

app.post("/add-kliping-cetak", function(request, response){
    response.redirect("/add-kliping-cetak");
})

app.get("/add-kliping-online", function(request, response){
    response.render("add-kliping-online");
})

app.post("/add-kliping-online", function(request, response){
    response.redirect("/add-kliping-online");
})

app.get("/login", function(request, response){
    response.render("login");
})

app.post("/login", function(request, response){
    
    const {inputName, inputPassword} = request.body;

    let query = `SELECT * FROM user_tb WHERE name = '${inputName}' `

    db.connect(function (err, client, done){
        if (err) throw err

        client.query(query, function(err, result){
            if (err) throw err

            console.log(result.rows); 

            if(result.rows.length == 0){
                response.redirect("/login") 

            } 

            const isMatch = bcrypt.compareSync(inputPassword, result.rows[0].password);
            
            console.log(isMatch);

            if(isMatch){
                response.redirect("/login")
            } else {
                response.redirect("/")}
        })
    })
})

app.get("/contact", function(req, response){
    response.render("contact");
})


app.get("/galery", function(request, response){
    response.render("galery", {isLogin: isLogin});
})

app.post("/galery", function(request, response){
    response.redirect("/galery");
})

app.get("/deleteRelease/:id", function(request, response){
    let id = request.params.id;

    let query = `DELETE FROM release_tb WHERE id  = ${id}`

    db.connect(function (err, client, result) {
        if (err) throw err

    client.query(query, function(err, result){
        if (err) throw err

        response.redirect("/release_online")
    })
        
    })

    // releaseOnline.splice(index, 1);

    // console.log(index);
  
    // response.redirect("/release_online");
})

app.get("/deleteklipingOnline/:id", function(request, response){

    let id = request.params.id;

    let query = `DELETE FROM kliping_online_tb WHERE id  = ${id}`

    db.connect(function (err, client, result) {
        if (err) throw err

    client.query(query, function(err, result){
        if (err) throw err

        response.redirect("/kliping_online")
    })
        
    })
    // klipingOnline.splice(index, 1);

    // console.log(index)
    // response.redirect("/kliping_online")
})

app.get("/deleteklipingCetak/:id", function(request, response){


    // klipingCetak.splice(index, 1)

    // console.log(index);
    let id = request.params.id;

    let query = `DELETE FROM kliping_cetak_tb WHERE id  = ${id}`

    db.connect(function (err, client, result) {
        if (err) throw err

    client.query(query, function(err, result){
        if (err) throw err


        response.redirect("/kliping_cetak")
    })
        
    })
})

app.listen(PORT, function(){
    console.log(`server is running this port ${PORT}`)
})