import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(json({ limit: '100mb' }));
    app.use(urlencoded({ limit: '100mb', extended: true }));
    const config = new DocumentBuilder()
        .setTitle('BeReal API')
        .setDescription('An unofficial API for BeReal')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    app.enableCors({
        origin: '*',
        credentials: true,
    });
    await app.listen(process.env.PORT || 3000, () =>
        console.log('Listening on port ' + (process.env.PORT || 3000)),
    );
}
bootstrap();
