# kroskaGPT
Essa API é uma solução para desenvolvedores que desejam utilizar a tecnologia de geração da OpenAI em seus aplicativos. Com diversos endpoints disponíveis, é possível gerar textos, imagens e editar imagens, utilizando prompts e modelos específicos.

## Como Usar
Para utilizar essa API, é necessário enviar uma requisição HTTP para um dos endpoints disponíveis, fornecendo as entradas necessárias para a geração de texto ou imagem. É importante ressaltar que a API realiza validações para garantir que as entradas sejam válidas antes de enviar as solicitações para a OpenAI, a fim de garantir respostas precisas e relevantes.

## Endpoints

#### `completion`
Este endpoint permite a geração de texto baseado em um texto de entrada e um prompt. É necessário fornecer um texto de entrada e um prompt como entrada na requisição HTTP. O endpoint retornará uma resposta gerada pela OpenAI baseada nessa entrada.

#### `image`
Este endpoint permite a geração de imagem baseada em um prompt, um modelo de imagem e um tamanho de imagem. É necessário fornecer um prompt, um modelo de imagem e um tamanho de imagem como entrada na requisição HTTP. O endpoint retornará uma imagem gerada pela OpenAI baseada nessas entradas.

#### `image-edit`
Este endpoint permite a edição de imagem baseada em uma imagem de entrada, uma máscara e um prompt. É necessário fornecer uma imagem de entrada, uma máscara e um prompt como entrada na requisição HTTP. O endpoint retornará uma imagem editada pela OpenAI baseada nessas entradas.

### Conclusão
o KroskaGPT é uma ferramenta poderosa e segura para interagir com a API de geração da OpenAI. Com os endpoints de texto, imagem e edição de imagem, é possível explorar as possibilidades oferecidas pela OpenAI e criar aplicativos inovadores e impressionantes.
