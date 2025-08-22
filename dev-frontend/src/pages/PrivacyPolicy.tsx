import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          
          <h1 className="text-4xl font-bold mb-8 text-foreground">
            Политика конфиденциальности
          </h1>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                (домен: https://leanwebstudio.ru/, ред. от 09.08.2025)
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Общие положения</h2>
              <p>
                Настоящая Политика описывает, как владелец сайта https://leanwebstudio.ru/ (далее — «Оператор», «мы») 
                обрабатывает персональные данные посетителей сайта. Политика разработана в соответствии с законодательством 
                РФ о персональных данных.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Оператор и контакты</h2>
              <p>Оператор: владелец сайта https://leanwebstudio.ru/</p>
              <p>E-mail для обращений по персональным данным: leanwebstudio@yandex.ru</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Какие данные мы обрабатываем</h2>
              <p>Только данные, которые пользователь указывает в формах на сайте:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Имя</li>
                <li>Номер телефона</li>
                <li>Название компании (если указано)</li>
                <li>Комментарий (свободный текст)</li>
              </ul>
              <p className="mt-2">Платёжные данные на сайте не собираются.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Цели обработки</h2>
              <ul className="list-disc pl-6">
                <li>Ответ на обращение и коммуникация по запросу пользователя</li>
                <li>Подготовка и направление предложений, расчётов, уточняющих вопросов</li>
                <li>Ведение учёта обращений и улучшение качества сервиса</li>
                <li>Исполнение требований законодательства, если применимо</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Правовые основания</h2>
              <ul className="list-disc pl-6">
                <li>Согласие пользователя (отмечается галочкой в форме перед отправкой)</li>
                <li>Законный интерес Оператора — обработка обращений и ведение переписки по инициативе пользователя</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Срок хранения</h2>
              <p>
                Данные хранятся до достижения целей обработки или до отзыва согласия пользователем, но не дольше 36 месяцев 
                с даты последнего взаимодействия, если иное не требуется законом.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Передача третьим лицам</h2>
              <p>Мы не передаём персональные данные третьим лицам, за исключением:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>провайдеров хостинга/инфраструктуры и почтовых сервисов, которые обеспечивают работу сайта и доставки сообщений,</li>
                <li>случаев, предусмотренных законом.</li>
              </ul>
              <p className="mt-2">Все такие лица действуют на основании договоров и обязуются соблюдать конфиденциальность.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Трансграничная передача</h2>
              <p>
                Если технически задействованы серверы, расположенные за пределами РФ (почтовые/инфраструктурные сервисы), 
                передача осуществляется при соблюдении требований законодательства к трансграничной передаче персональных данных.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Безопасность</h2>
              <p>
                Мы применяем организационные и технические меры для защиты данных от несанкционированного доступа, 
                изменения, раскрытия или уничтожения.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Права пользователя</h2>
              <p>Вы вправе:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>получать сведения об обработке ваших данных,</li>
                <li>требовать уточнения, блокирования или удаления данных,</li>
                <li>отзывать согласие на обработку.</li>
              </ul>
              <p className="mt-2">
                Для реализации прав направьте запрос на leanwebstudio@yandex.ru с пометкой «Персональные данные».
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Отзыв согласия</h2>
              <p>
                Согласие может быть отозвано вами в любой момент через письмо на leanwebstudio@yandex.ru. 
                Отзыв согласия не влияет на законность обработки, осуществлённой до отзыва.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">12. Изменения Политики</h2>
              <p>
                Мы можем обновлять Политику. Актуальная версия всегда доступна на странице /privacy-policy. 
                Дата последнего обновления указана в заголовке.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;