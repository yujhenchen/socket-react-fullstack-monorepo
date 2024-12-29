FROM node:23-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN corepack pnpm --version

RUN pnpm add -g serve

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
# RUN pnpm deploy --filter=backend --prod /prod/backend
RUN pnpm deploy --filter=web --prod /prod/web

# # backend
# FROM base AS backend
# COPY --from=build /prod/backend /prod/backend
# WORKDIR /prod/backend
# EXPOSE 8000
# CMD [ "pnpm", "start" ]

# web
FROM base AS web
COPY --from=build /prod/web /prod/web
WORKDIR /prod/web
EXPOSE 5173
CMD [ "serve", "-s", "dist", "-l", "5173" ]
