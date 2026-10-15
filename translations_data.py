# -*- coding: utf-8 -*-
"""
Jan Suraaj Vyavasaik Prakoshth - Multilingual Translation Engine
Provides full Hindi transliteration & translation for names, profiles,
designations, locations, categories, castes, and political bios.
"""
import re

NAME_WORDS = {
    'a': 'ए', 'abbas': 'अब्बास', 'abhijeet': 'अभिजीत', 'abhinav': 'अभिनव', 'abhishek': 'अभिषेक',
    'abu': 'अबू', 'achyut': 'अच्युत', 'adarsh': 'आदर्श', 'aditya': 'आदित्य', 'agarwal': 'अग्रवाल',
    'aggarwal': 'अग्रवाल', 'ahtasham': 'एहतेशाम', 'ajay': 'अजय', 'ajeet': 'अजीत', 'aka': 'उर्फ',
    'akash': 'आकाश', 'alam': 'आलम', 'alias': 'उर्फ', 'alok': 'आलोक', 'aman': 'अमन',
    'amarnath': 'अमरनाथ', 'amartya': 'अमर्त्य', 'amin': 'अमीन', 'amit': 'अमित', 'amrendra': 'अमरेन्द्र',
    'amresh': 'अमरेश', 'amrit': 'अमृत', 'anand': 'आनंद', 'anant': 'अनंत', 'anil': 'अनिल',
    'anjana': 'अंजना', 'ankit': 'अंकित', 'ansari': 'अंसारी', 'arun': 'अरुण', 'arya': 'आर्य',
    'ashish': 'आशीष', 'ashok': 'अशोक', 'ashwini': 'अश्विनी', 'atri': 'अत्री', 'atul': 'अतुल',
    'atuque': 'अतीक', 'awadhesh': 'अवधेश', 'azad': 'आजाद', 'bablu': 'बबलू', 'babu': 'बाबू',
    'balram': 'बलराम', 'bandhal': 'बंधाल', 'barnawal': 'बरनवाल', 'barnwal': 'बरनवाल', 'basuki': 'बासुकी',
    'bhagat': 'भगत', 'bhai': 'भाई', 'bharti': 'भारती', 'bhim': 'भीम', 'bhola': 'भोला',
    'bhushan': 'भूषण', 'bihari': 'बिहारी', 'bimlesh': 'बिमलेश', 'boudha': 'बौद्ध', 'brajendra': 'बृजेंद्र',
    'brajesh': 'ब्रजेश', 'chanakya': 'चाणक्य', 'chand': 'चंद', 'chandan': 'चंदन', 'chandra': 'चंद्र',
    'chaudhari': 'चौधरी', 'chaudhary': 'चौधरी', 'chaurasiya': 'चौरसिया', 'chita': 'चीता', 'chotan': 'छोटन',
    'darda': 'दरदा', 'das': 'दास', 'dayanand': 'दयानंद', 'deepak': 'दीपक', 'dev': 'देव',
    'devendra': 'देवेंद्र', 'dhananjay': 'धनंजय', 'dhar': 'धर', 'dharmaraj': 'धर्मराज', 'dharmendra': 'धर्मेन्द्र',
    'dharmveer': 'धर्मवीर', 'dharni': 'धरणी', 'dheerendra': 'धीरेन्द्र', 'digvijay': 'दिग्विजय', 'dileep': 'दिलीप',
    'dilip': 'दिलीप', 'dinesh': 'दिनेश', 'diwakar': 'दिवाकर', 'dr': 'डॉ.', 'dubey': 'दुबे',
    'duggal': 'दुग्गल', 'dutt': 'दत्त', 'gaurav': 'गौरव', 'gautam': 'गौतम', 'giri': 'गिरि',
    'girish': 'गिरीश', 'golden': 'गोल्डन', 'gopal': 'गोपाल', 'gopesh': 'गोपेश', 'goswami': 'गोस्वामी',
    'govind': 'गोविंद', 'guddu': 'गुड्डू', 'gulab': 'गुलाब', 'gunjan': 'गुंजन', 'gupta': 'गुप्ता',
    'gupteshwar': 'गुप्तेश्वर', 'gyan': 'ज्ञान', 'hans': 'हंस', 'haque': 'हक', 'harendra': 'हरेंद्र',
    'harischandra': 'हरीशचंद्र', 'harish': 'हरीश', 'harishankar': 'हरिशंकर', 'harshvardhan': 'हर्षवर्धन', 'hussain': 'हुसैन',
    'imtiyaz': 'इम्तियाज', 'indrabhushan': 'इंद्रभूषण', 'indrajeet': 'इंद्रजीत', 'jagdeesh': 'जगदीश', 'jai': 'जय',
    'jain': 'जैन', 'jainendra': 'जैनेंद्र', 'jaiprakash': 'जयप्रकाश', 'jaiswal': 'जायसवाल', 'jamadar': 'जमादार',
    'jawahar': 'जवाहर', 'jayant': 'जयंत', 'jha': 'झा', 'ji': 'जी', 'jitendra': 'जितेंद्र',
    'kailu': 'कैलू', 'kalanand': 'कलानंद', 'kamlesh': 'कमलेश', 'kant': 'कांत', 'kanu': 'कानू',
    'kapri': 'कापरी', 'karan': 'करण', 'kaushal': 'कौशल', 'keshav': 'केशव', 'keshri': 'केसरी',
    'khanna': 'खन्ना', 'khemka': 'खेमका', 'kishore': 'किशोर', 'kk': 'के.के.', 'kr': 'कुमार',
    'kripal': 'कृपाल', 'krishna': 'कृष्ण', 'kuma': 'कुमार', 'kumar': 'कुमार', 'kunal': 'कुणाल',
    'kushwaha': 'कुशवाहा', 'laadh': 'लाध', 'lakhotiya': 'लखोटिया', 'lakshman': 'लक्ष्मण', 'lakshmi': 'लक्ष्मी',
    'lal': 'लाल', 'lala': 'लाला', 'lalan': 'ललन', 'lalit': 'ललित', 'latth': 'लट्ठा',
    'madan': 'मदन', 'mahaveer': 'महावीर', 'mahesh': 'महेश', 'mali': 'माली', 'mandal': 'मंडल',
    'manikant': 'मणिकांत', 'maniraj': 'मणिराज', 'manish': 'मनीष', 'manjeet': 'मनजीत', 'manmohan': 'मनमोहन',
    'manoj': 'मनोज', 'manoranjan': 'मनोरंजन', 'md': 'मो.', 'mishra': 'मिश्रा', 'mithilesh': 'मिथिलेश',
    'mithun': 'मिथुन', 'moeem': 'मोईम', 'mohammad': 'मोहम्मद', 'mukesh': 'मुकेश', 'mukhiya': 'मुखिया',
    'mulchand': 'मूलचंद', 'mumtaz': 'मुमताज', 'munna': 'मुन्ना', 'nalin': 'नलिन', 'nandan': 'नंदन',
    'narayan': 'नारायण', 'narendra': 'नरेंद्र', 'nasar': 'नासर', 'nirala': 'निराला', 'nirmal': 'निर्मल',
    'nitesh': 'नितेश', 'nitish': 'नीतीश', 'nizam': 'निजाम', 'ojha': 'ओझा', 'om': 'ओम',
    'pandey': 'पांडेय', 'pankaj': 'पंकज', 'pannalal': 'पन्नालाल', 'pappu': 'पप्पू', 'parmeshwar': 'परमेश्वर',
    'parsad': 'प्रसाद', 'paswan': 'पासवान', 'patel': 'पटेल', 'pathak': 'पाठक', 'pawan': 'पवन',
    'pintu': 'पिंटू', 'poddar': 'पोद्दार', 'prabhakar': 'प्रभाकर', 'prabhansh': 'प्रभांश', 'prabhat': 'प्रभात',
    'prabhu': 'प्रभु', 'pradeep': 'प्रदीप', 'pradhan': 'प्रधान', 'pradip': 'प्रदीप', 'prakash': 'प्रकाश',
    'pramod': 'प्रमोद', 'prasad': 'प्रसाद', 'prashant': 'प्रशांत', 'pratyush': 'प्रत्युष', 'praveen': 'प्रवीण',
    'pravesh': 'प्रवेश', 'pravin': 'प्रवीण', 'purushotam': 'पुरुषोत्तम', 'purve': 'पूर्वे', 'rahul': 'राहुल',
    'rai': 'राय', 'raj': 'राज', 'rajan': 'राजन', 'rajbhushan': 'राजभूषण', 'rajeev': 'राजीव',
    'rajendra': 'राजेन्द्र', 'rajesh': 'राजेश', 'rajiv': 'राजीव', 'rajkishore': 'राजकिशोर', 'rajkumar': 'राजकुमार',
    'rajnandan': 'राजनंदन', 'rajnish': 'रजनीश', 'raju': 'राजू', 'rajv': 'राजीव', 'rakesh': 'राकेश',
    'ram': 'राम', 'ramesh': 'रमेश', 'rameshwar': 'रामेश्वर', 'ramnath': 'रामनाथ', 'randhir': 'रणधीर',
    'ranjan': 'रंजन', 'ranjeet': 'रणजीत', 'raut': 'राउत', 'ravi': 'रवि', 'ravinath': 'रविनाथ',
    'ravindra': 'रवींद्र', 'ravishankar': 'रविशंकर', 'ray': 'राय', 'rikesh': 'रिकेश', 'rishikesh': 'ऋषिकेश',
    'ritesh': 'रितेश', 'rohit': 'रोहित', 'roushan': 'रौशन', 'roy': 'रॉय', 'rupesh': 'रूपेश',
    'saddam': 'सद्दाम', 'sah': 'साह', 'sahu': 'साहू', 'sajjan': 'सज्जन', 'samar': 'समर',
    'sambhu': 'शंभू', 'sandeep': 'संदीप', 'sandip': 'संदीप', 'sanjay': 'संजय', 'sanjeev': 'संजीव',
    'sanoj': 'सनोज', 'sant': 'संत', 'santosh': 'संतोष', 'saraf': 'सर्राफ', 'saraswati': 'सरस्वती',
    'saroj': 'सरोज', 'satrughan': 'शत्रुघ्न', 'satya': 'सत्य', 'satyam': 'सत्यम', 'satyendra': 'सत्येंद्र',
    'saurav': 'सौरव', 'saw': 'साव', 'sen': 'सेन', 'shah': 'शाह', 'shambhu': 'शंभू',
    'shamim': 'शमीम', 'shamsad': 'शमशाद', 'shankar': 'शंकर', 'sharma': 'शर्मा', 'shashi': 'शशि',
    'shaw': 'शॉ', 'shekhar': 'शेखर', 'shiromani': 'शिरोमणि', 'shiv': 'शिव', 'shivnath': 'शिवनाथ',
    'shrivastava': 'श्रीवास्तव', 'shukla': 'शुक्ला', 'sikandar': 'सिकंदर', 'sindhu': 'सिंधु', 'singh': 'सिंह',
    'sinha': 'सिन्हा', 'sonar': 'सोनार', 'soni': 'सोनी', 'sonu': 'सोनू', 'srivastava': 'श्रीवास्तव',
    'subodh': 'सुबोध', 'sudama': 'सुदामा', 'sudhir': 'सुधीर', 'sujit': 'सुजीत', 'sultaniya': 'सुलतानिया',
    'sunil': 'सुनील', 'sunny': 'सनी', 'suresh': 'सुरेश', 'surya': 'सूर्य', 'sushant': 'सुशांत',
    'sushil': 'सुशील', 'tapeshwar': 'तपेश्वर', 'tarun': 'तरुण', 'thakur': 'ठाकुर', 'thatera': 'ठठेरा',
    'tikamani': 'टिकमानी', 'tiwari': 'तिवारी', 'tupamari': 'तुपामारी', 'ujjawal': 'उज्ज्वल', 'ujjwal': 'उज्ज्वल',
    'umesh': 'उमेश', 'upendra': 'उपेन्द्र', 'urf': 'उर्फ', 'utkarsh': 'उत्कर्ष', 'vels': 'वेल्स',
    'verma': 'वर्मा', 'vibhuti': 'विभूति', 'vijay': 'विजय', 'vijendra': 'विजेंद्र', 'vimal': 'विमल',
    'vinod': 'विनोद', 'virendra': 'वीरेंद्र', 'vishesh': 'विशेष', 'vishnu': 'विष्णु', 'yadav': 'यादव',
    'yusuf': 'यूसुफ'
}

SPECIAL_NAMES = {
    'Ram Krishna Tarun': 'राम कृष्ण तरुण',
    'Jayant Kumar Singh': 'जयंत कुमार सिंह',
    'Maniraj Singh': 'मणिराज सिंह',
    'Dr. Anjana Yadav': 'डॉ. अंजना यादव',
    'Kamlesh Kant Giri': 'कमलेश कांत गिरि',
    'Upendra Kumar Vibhuti': 'उपेन्द्र कुमार विभूति',
    'Kamlesh Kumar': 'कमलेश कुमार',
    'Sandip Srivastava': 'संदीप श्रीवास्तव',
    'Shambhu Nath Keshari': 'शंभू नाथ केसरी',
    'Satyendra Narayan Singh': 'सत्येंद्र नारायण सिंह',
    'Ramesh Prasad': 'रमेश प्रसाद',
    'Rikesh Singh (Bhola jha)': 'रिकेश सिंह (भोला झा)',
    'Rajbhushan Prabhu': 'राजभूषण प्रभु',
    'Manoj Mishra': 'मनोज मिश्रा',
    'Subodh Kumar Jha': 'सुबोध कुमार झा',
    'Ajay Kumar': 'अजय कुमार',
    'Ravishankar Poddar': 'रविशंकर पोद्दार',
    'Lakshman Kumar': 'लक्ष्मण कुमार',
    'Kumar Chanakya Alok': 'कुमार चाणक्य आलोक',
    'Ashwini Jha': 'अश्विनी झा',
    'Satyam Chaudhary': 'सत्यम चौधरी',
    'Saddam Hussain': 'सद्दाम हुसैन',
    'Sonu Singh': 'सोनू सिंह',
    'Santosh Kumar Singh': 'संतोष कुमार सिंह',
    'Narendra Kumar Dev': 'नरेंद्र कुमार देव'
}

DISTRICTS_HI = {
    'Patna': 'पटना', 'Siwan': 'सीवान', 'Nawada': 'नवादा', 'Vaishali': 'वैशाली', 'Madhepura': 'मधेपुरा',
    'East Champaran': 'पूर्वी चंपारण', 'West Champaran': 'पश्चिम चंपारण', 'Bettiah': 'बेतिया',
    'Motihari': 'मोतिहारी', 'Gaya': 'गया', 'Bhagalpur': 'भागलपुर', 'Muzaffarpur': 'मुज़फ़्फ़रपुर',
    'Darbhanga': 'दरभंगा', 'Purnea': 'पूर्णिया', 'Nalanda': 'नालंदा', 'Saran': 'सारण',
    'Rohtas': 'रोहतास', 'Kaimur': 'कैमूर', 'Bhojpur': 'भोजपुर', 'Buxar': 'बक्सर',
    'Aurangabad': 'औरंगाबाद', 'Jehanabad': 'जहानाबाद', 'Arwal': 'अरवल', 'Jamui': 'जमुई',
    'Munger': 'मुंगेर', 'Lakhisarai': 'लखीसराय', 'Sheikhpura': 'शेखपुरा', 'Begusarai': 'बेगूसराय',
    'Khagaria': 'खगड़िया', 'Saharsa': 'सहरसा', 'Supaul': 'सुपौल', 'Katihar': 'कटिहार',
    'Araria': 'अररिया', 'Kishanganj': 'किशनगंज', 'Samastipur': 'समस्तीपुर', 'Sitamarhi': 'सीतामढ़ी',
    'Sheohar': 'शिवहर', 'Madhubani': 'मधुबनी', 'Gopalganj': 'गोपालगंज', 'Patna Mahanagar': 'पटना महानगर',
    'Patna Rural': 'पटना ग्रामीण', 'Bagaha': 'बगहा', 'Narkatiaganj': 'नरकटियागंज', 'Navgachia': 'नवगछिया', 'Barh': 'बाढ़'
}

ZONES_HI = {
    'Tirhut': 'तिरहुत', 'Magadh': 'मगध', 'Mithila': 'मिथिला', 'Mithilanchal': 'मिथिलांचल', 'Kosi': 'कोसी',
    'Purnea': 'पूर्णिया', 'Saran': 'सारण', 'Patna': 'पटना', 'Shahabad': 'शाहाबाद', 'Shahbad': 'शाहाबाद',
    'Munger': 'मुंगेर', 'Anga': 'अंग (भागलपुर)', 'Bhagalpur': 'भागलपुर',
    'Nalanda': 'नालंदा', 'Samastipur': 'समस्तीपुर', 'Seemanchal': 'सीमांचल', 'Champaran': 'चंपारण'
}

POSTS_HI = {
    'State President': 'प्रदेश अध्यक्ष',
    'State General Secretary': 'प्रदेश महासचिव',
    'State Gen Sec': 'प्रदेश महासचिव',
    'State VP': 'प्रदेश उपाध्यक्ष',
    'State Vice President': 'प्रदेश उपाध्यक्ष',
    'Zonal': 'ज़ोनल प्रभारी',
    'Zonal Incharge': 'ज़ोनल प्रभारी',
    'District President': 'ज़िला अध्यक्ष',
    'District Gen Sec': 'ज़िला महासचिव',
    'District General Secretary': 'ज़िला महासचिव',
    'State Core Committee': 'प्रदेश कोर कमेटी सदस्य',
    'District Core Comm': 'ज़िला कोर कमेटी सदस्य',
    'Core Committee Member': 'कोर कमेटी सदस्य',
    'Sanyojak': 'संयोजक',
    'Sah Sanyojak': 'प्रदेश सह - संयोजक',
    'Members': 'अभियान समिति सदस्य',
    'Campaign Committe Member': 'अभियान समिति सदस्य',
    'Campaign Committee Member': 'अभियान समिति सदस्य',
    'Abhiyan Samiti Sadasya': 'अभियान समिति सदस्य'
}

CATEGORIES_HI = {
    'General': 'सामान्य',
    'Gen': 'सामान्य',
    'OBC': 'ओबीसी (OBC)',
    'EBC': 'ईबीसी (EBC)',
    'SC': 'अनुसूचित जाति (SC)',
    'ST': 'अनुसूचित जनजाति (ST)',
    'Minority': 'अल्पसंख्यक',
    'Minority (Buddhist)': 'अल्पसंख्यक (बौद्ध)'
}

CASTES_HI = {
    'Bhumihar': 'भूमिहार', 'Bhumihaar': 'भूमिहार',
    'Rajput': 'राजपूत',
    'Baniya': 'बनिया', 'Bania': 'बनिया', 'Bania (Vaishya)': 'बनिया (वैश्य)', 'Vaishya': 'वैश्य', 'Samrih vaisya': 'वैश्य',
    'Kalwar': 'कलवार',
    'Brahmin': 'ब्राह्मण', 'Brahamin': 'ब्राह्मण',
    'Yadav': 'यादव',
    'Sonar': 'सोनार',
    'Teli': 'तेली', 'Suri': 'सूरी', 'Suri Bania': 'सूरी बनिया',
    'Kanu': 'कानू', 'Kaun': 'कानू',
    'Kayastha': 'कायस्थ', 'Kayasth': 'कायस्थ', 'Kaysatha': 'कायस्थ',
    'Kurmi': 'कुर्मी', 'Patel': 'पटेल',
    'Kushwaha': 'कुशवाहा', 'Koiri': 'कोइरी',
    'Halwai': 'हलवाई',
    'Barnwal': 'बरनवाल', 'Barnawal': 'बरनवाल',
    'Marwari': 'मारवाड़ी', 'Marwadi': 'मारवाड़ी',
    'Mallah': 'मल्लाह',
    'Nonia': 'नोनिया',
    'Dusadh': 'दुसाध', 'Chamar': 'रविदास (चमार)', 'Chamar/Ravidas': 'रविदास (चमार)',
    'Muslim': 'मुस्लिम',
    'Jain': 'जैन',
    'Baudhist': 'बौद्ध',
    'Chandel': 'चंदेल',
    'Chandravanshi': 'चंद्रवंशी', 'Kahar': 'कहार (चंद्रवंशी)',
    'Badhai': 'बढ़ई',
    'Gangota': 'गंगोता',
    'Mali': 'माली',
    'Mehtar': 'मेहतर',
    'Thathera': 'ठठेरा',
    'Agahri Vaishya': 'अग्रहरि वैश्य'
}

SECTORS_HI = {
    'Hospitality': 'हॉस्पिटैलिटी एवं होटल',
    'Poultry & Agro': 'पोल्ट्री एवं कृषि उद्योग',
    'Jewellery': 'स्वर्ण व आभूषण',
    'Healthcare & Pharma': 'स्वास्थ्य व दवा उद्योग',
    'Automobile & EV': 'ऑटोमोबाइल व ईवी',
    'Construction & Real Estate': 'निर्माण व रियल एस्टेट',
    'Education': 'शिक्षा संस्थान',
    'Petroleum & Energy': 'पेट्रोलियम व ऊर्जा',
    'Logistics & Transport': 'परिवहन व लॉजिस्टिक्स',
    'Legal': 'विधिक (अधिवक्ता)',
    'Trading & Retail': 'थोक एवं खुदरा व्यापार',
    'Grassroots Elected': 'जमीनी जनप्रतिनिधि'
}

PARTIES_HI = {
    'Former BJP': 'पूर्व भाजपा',
    'Former Congress': 'पूर्व कांग्रेस',
    'Former JDU': 'पूर्व जदयू',
    'Former RJD': 'पूर्व राजद',
    'Former LJP': 'पूर्व लोजपा'
}

PRIORITY_TIERS_HI = {
    'Critical': 'अति-महत्वपूर्ण (Critical)',
    'Developing': 'विकासशील (Developing)',
    'Active': 'सक्रिय (Active)'
}

def transliterate_name(name):
    if not name:
        return ''
    s = name.strip()
    if s in SPECIAL_NAMES:
        return SPECIAL_NAMES[s]
    
    # Handle parentheses
    def repl_paren(match):
        inner = match.group(1).strip()
        parts = []
        for word in inner.split():
            w_clean = re.sub(r'[^\w]', '', word).lower()
            parts.append(NAME_WORDS.get(w_clean, word))
        return '(' + ' '.join(parts) + ')'

    res = re.sub(r'\((.*?)\)', repl_paren, s)
    
    words = res.split()
    translated_words = []
    for w in words:
        if w.startswith('(') and w.endswith(')'):
            translated_words.append(w)
            continue
        w_clean = re.sub(r'[^\w]', '', w).lower()
        if w_clean in NAME_WORDS:
            translated_words.append(NAME_WORDS[w_clean])
        elif w.endswith('.') and w[:-1].lower() in NAME_WORDS:
            translated_words.append(NAME_WORDS[w[:-1].lower()])
        else:
            translated_words.append(w)
            
    return ' '.join(translated_words)

PROFILE_PHRASES = [
    (r'\bFormer Congress Member\b', 'पूर्व कांग्रेस सदस्य'),
    (r'\bFormer Congress\b', 'पूर्व कांग्रेस'),
    (r'\bFormer BJP Yuva Mahamantri\b', 'पूर्व भाजपा युवा महामंत्री'),
    (r'\bFormer BJP\b', 'पूर्व भाजपा'),
    (r'\bFormer JDU\b', 'पूर्व जदयू'),
    (r'\bFormer RJD\b', 'पूर्व राजद'),
    (r'\bFormer LJP\b', 'पूर्व लोजपा'),
    (r'\bEx JS Zila Mukhya Pravakta\b', 'पूर्व जन सुराज ज़िला मुख्य प्रवक्ता'),
    (r'\bJan Suraaj State Core Committee Member\b', 'जन सुराज प्रदेश कोर कमेटी सदस्य'),
    (r'\bJan Suraaj\b', 'जन सुराज'),
    (r'\bJansuraj\b', 'जन सुराज'),
    (r'\bFather was Freedom Fighter\b', 'पिता स्वतंत्रता सेनानी थे'),
    (r'\bFreedom Fighter\b', 'स्वतंत्रता सेनानी'),
    (r'\bDirector Of (\d+) Colleges\b', r'\1 कॉलेजों के निदेशक'),
    (r'\bOwner Of Petrol Pump\b', 'पेट्रोल पंप के मालिक'),
    (r'\bPetrol Pump\b', 'पेट्रोल पंप'),
    (r'\bOwner Of Transport Business\b', 'परिवहन व्यवसाय के मालिक'),
    (r'\bOwns Hotel Royal Orbit in Rajauli\b', 'रजौली में होटल रॉयल ऑर्बिट के मालिक'),
    (r'\bBuilding Multiple Hotels in Nawada\b', 'नवादा में कई होटलों का निर्माण'),
    (r'\bReal Estate business in Bangalore\b', 'बैंगलोर में रियल एस्टेट व्यवसाय'),
    (r'\bBig Cement Business\b', 'बड़ा सीमेंट व्यवसाय'),
    (r'\bMines Business in Jharkhad\b', 'झारखंड में खनन व्यवसाय'),
    (r'\bOwns an Egg Factory in Siliguri\b', 'सिलीगुड़ी में अंडा फैक्ट्री के मालिक'),
    (r'\bContested the PACS election\b', 'पैक्स चुनाव लड़ा'),
    (r'\bHis younger brother is the current Mukhiya\b', 'उनके छोटे भाई वर्तमान मुखिया हैं'),
    (r'\bOwner of Anjana Nursing Home\b', 'अंजना नर्सिंग होम की संचालिका'),
    (r'\bSocial Activist\b', 'सामाजिक कार्यकर्ता'),
    (r'\bSocial Worker\b', 'सामाजिक कार्यकर्ता'),
    (r'\bProminent Businessman\b', 'प्रमुख उद्योगपति एवं व्यवसायी'),
    (r'\bProminent businessman\b', 'प्रमुख उद्योगपति एवं व्यवसायी'),
    (r'\bDistrict Secretary of Swarnkar Sangathan\b', 'स्वर्णकार संगठन के ज़िला सचिव'),
    (r'\bOwnes Chain of Rajpati Jewellers\b', 'राजपति ज्वेलर्स श्रृंखला के मालिक'),
    (r'\bRuns a Imperishable Security Services\b', 'इम्पेरिशेबल सिक्योरिटी सर्विसेज के संचालक'),
    (r'\bFormer Cooperative bank director\b', 'पूर्व सहकारी बैंक निदेशक'),
    (r'\bFirst runner up in cooperation chairman election\b', 'सहकारिता अध्यक्ष चुनाव में उप-विजेता'),
    (r'\bIncumbent PACS Adhyaksh\b', 'वर्तमान पैक्स अध्यक्ष'),
    (r'\bIncumbent PACS Chairman\b', 'वर्तमान पैक्स अध्यक्ष'),
    (r'\bHis brother was Mukhiya in (\d+)\b', r'उनके भाई \1 में मुखिया थे'),
    (r'\bDrug wholesaler as well as travel agent\b', 'दवा के थोक विक्रेता एवं ट्रेवल एजेंट'),
    (r'\bPradesh Adhyaksh\b', 'प्रदेश अध्यक्ष'),
    (r'\bPradesh Mahasachiv\b', 'प्रदेश महासचिव'),
    (r'\bLoksabha Prabhari\b', 'लोकसभा प्रभारी'),
    (r'\bSah Sanyojak\b', 'सह-संयोजक'),
    (r'\bSanyojak\b', 'संयोजक'),
    (r'\bRashtriya Upadhyaksh Sah Pravakta\b', 'राष्ट्रीय उपाध्यक्ष सह प्रवक्ता'),
    (r'\bKhudra Vyavasayi Sangh Adhyaksh\b', 'खुदरा व्यवसायी संघ अध्यक्ष'),
    (r'\bPresident of Chamber of Commerce\b', 'चेंबर ऑफ कॉमर्स अध्यक्ष'),
    (r'\bRashtriya Vaishya Mahasabha\b', 'राष्ट्रीय वैश्य महासभा'),
    (r'\bRashtriya Hindu Mahasabha\b', 'राष्ट्रीय हिंदू महासभा'),
    (r'\bInternational Manav Adhikar Suraksha Foundation\b', 'इंटरनेशनल मानवाधिकार सुरक्षा फाउंडेशन'),
    (r'\bMale\b', 'पुरुष'),
    (r'\bFemale\b', 'महिला'),
    (r'\bGeneral\b', 'सामान्य'),
    (r'\bYears\b', 'वर्ष'),
    (r'\bDistrict\b', 'ज़िला'),
    (r'\bState\b', 'प्रदेश'),
    (r'\bPresident\b', 'अध्यक्ष'),
    (r'\bSecretary\b', 'सचिव'),
    (r'\bGeneral Secretary\b', 'महासचिव'),
    (r'\bVice President\b', 'उपाध्यक्ष'),
    (r'\bContractor\b', 'ठेकेदार'),
    (r'\bBusinessman\b', 'व्यवसायी'),
    (r'\bMukhiya\b', 'मुखिया'),
    (r'\bWard Parshad\b', 'वार्ड पार्षद'),
    (r'\bOwner\b', 'मालिक'),
    (r'\bOwns\b', 'मालिक हैं'),
    (r'\bRuns\b', 'संचालन करते हैं')
]

def translate_profile(profile_text, name_hi=''):
    if not profile_text:
        return ''
    lines = profile_text.split('\n')
    translated_lines = []
    
    for idx, line in enumerate(lines):
        line_str = line.strip()
        if not line_str:
            translated_lines.append('')
            continue
            
        if '|' in line_str and idx < 3:
            parts = [p.strip() for p in line_str.split('|')]
            trans_parts = []
            for p in parts:
                p_low = p.lower()
                if not p:
                    continue
                if p_low == 'male': trans_parts.append('पुरुष')
                elif p_low == 'female': trans_parts.append('महिला')
                elif p_low in ['gen', 'general']: trans_parts.append('सामान्य')
                elif p_low == 'obc': trans_parts.append('ओबीसी')
                elif p_low == 'ebc': trans_parts.append('ईबीसी')
                elif p_low == 'sc': trans_parts.append('एससी')
                elif p_low == 'st': trans_parts.append('एसटी')
                elif p in CASTES_HI: trans_parts.append(CASTES_HI[p])
                elif p in DISTRICTS_HI: trans_parts.append(DISTRICTS_HI[p])
                elif p.isdigit(): trans_parts.append(f"{p} वर्ष")
                elif re.match(r'^\d{10}$', p): trans_parts.append(p)
                elif name_hi and (p.lower() in name_hi.lower() or idx == 0 and len(parts) > 2):
                    trans_parts.append(name_hi)
                else:
                    trans_parts.append(transliterate_name(p))
            translated_lines.append(' | '.join(trans_parts))
            continue
            
        res = line_str
        for pattern, repl in PROFILE_PHRASES:
            res = re.sub(pattern, repl, res, flags=re.IGNORECASE)
            
        for dist_en, dist_hi in DISTRICTS_HI.items():
            res = re.sub(r'\b' + dist_en + r'\b', dist_hi, res, flags=re.IGNORECASE)
        for caste_en, caste_hi in CASTES_HI.items():
            res = re.sub(r'\b' + caste_en + r'\b', caste_hi, res, flags=re.IGNORECASE)
            
        translated_lines.append(res)
        
    return '\n'.join(translated_lines)
