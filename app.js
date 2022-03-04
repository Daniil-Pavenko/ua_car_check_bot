import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import axios from 'axios';


dotenv.config();

const TOKEN = process.env.BOT_TOKEN ?? "API_KEY";

const bot = new Telegraf(TOKEN)

bot.start((ctx) => {
	ctx.reply('Бот призначений для отримання інформації по автомобільним номерам, вводьте англійською мовою номер без пробілів.')
})

bot.on('text', async (ctx) => {
	let numberOfCar = ctx.message.text
	console.log(`Request car: ${numberOfCar}`);
	var isCorrectNumber = true

	// try {
	// 	isCorrectNumber = numberOfCar.match("^[a-zA-Z]{2}+[0-9]{4}+[a-zA-Z]{2}$")
	// } catch (error) {
	// 	isCorrectNumber = false
	// }

	if (isCorrectNumber) {
		ctx.reply('Почекайте хвилинку, шукаємо інформацію')
		axios.get(`https://opendatabot.com/api/v3/public/transport?number=${numberOfCar.toUpperCase()}`)
			.then(function (response) {
				let car = response.data
				if (car == undefined || car == null) {
					ctx.reply(`Автомобіль за номером ${numberOfCar} не знайдений. Обережно!!!`)
					return
				}
				let info = `<u>Знайдено за номером ${numberOfCar}</u>\n<b>Модель:</b> ${car.model}\n<b>Рік:</b> ${car.year}\n<b>Дата реєстрації:</b> ${car.date}\n<b>Колір:</b> ${car.color}\n<b>Тип:</b> ${car.body}\n<b>Реєстрація:</b> ${car.dep}`
				ctx.replyWithHTML(info)
		  	})
		  	.catch(function (error) {
				console.log(error);
				ctx.reply('Не корректний формат номеру авто, англійськими буквами. Приклад: AA1111KK')
		  	})
		  	.then(function () {
				// always executed
		  	});
	} else {
		ctx.reply('Не корректний формат номеру авто, англійськими буквами. Приклад: AA1111KK')
	}
})

console.log('Bot is started');
bot.launch();
